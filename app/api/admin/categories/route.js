import { connectDB } from "../../../lib/mongodb";
import Category from "../../../models/Category";
import { requireAuth } from "../../../middleware/auth";
import fs from "fs";
import path from "path";

// Helper to format category consistently
function formatCategory(category) {
  return {
    id: category._id.toString(),
    name: category.category_name,
    image: category.image || "",
    description: category.description || "",
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

// ==================== GET all categories or single category ====================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return new Response(
          JSON.stringify({ success: false, message: "Category not found" }),
          { status: 404 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, category: formatCategory(category) }),
        { status: 200 }
      );
    }

    const categories = await Category.find().sort({ createdAt: -1 });
    const formatted = categories.map(formatCategory);

    return new Response(
      JSON.stringify({ success: true, categories: formatted }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /categories error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
// POST create category
export async function POST(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(JSON.stringify({ success: false, message: authResult.error }), { status: authResult.status });
    }

    const { category_name, description, imageBase64 } = await req.json();
    if (!category_name) {
      return new Response(JSON.stringify({ success: false, message: "Category name is required" }), { status: 400 });
    }

    let imagePath = "";
    if (imageBase64) {
      const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (!matches) return new Response(JSON.stringify({ success: false, message: "Invalid image data" }), { status: 400 });

      const ext = matches[1].split("/")[1];
      const data = matches[2];
      const uploadDir = path.join(process.cwd(), "public/uploads/category");
      fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(data, "base64"));

      imagePath = `/uploads/category/${fileName}`;
    }

    let category;
    try {
      category = await Category.create({ category_name, description, image: imagePath });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.category_name) {
        return new Response(JSON.stringify({ success: false, message: "Category name already exists" }), { status: 400 });
      }
      throw err;
    }

    return new Response(JSON.stringify({ success: true, category: formatCategory(category) }), { status: 201 });
  } catch (error) {
    console.error("❌ POST error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

// PUT update category
export async function PUT(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) return new Response(JSON.stringify({ success: false, message: authResult.error }), { status: authResult.status });

    const { categoryId, category_name, description, imageBase64 } = await req.json();
    if (!categoryId) return new Response(JSON.stringify({ success: false, message: "Category ID is required" }), { status: 400 });

    // Duplicate name check
    if (category_name) {
      const existing = await Category.findOne({ category_name });
      if (existing && existing._id.toString() !== categoryId) {
        return new Response(JSON.stringify({ success: false, message: "Category name already exists" }), { status: 400 });
      }
    }

    const updateData = { category_name, description };

    // Handle new image
    if (imageBase64) {
      const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (!matches) return new Response(JSON.stringify({ success: false, message: "Invalid image data" }), { status: 400 });

      const ext = matches[1].split("/")[1];
      const data = matches[2];
      const uploadDir = path.join(process.cwd(), "public/uploads/category");
      fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(data, "base64"));

      // Delete old image if exists
      const categoryOld = await Category.findById(categoryId);
      if (categoryOld?.image) {
        const oldPath = path.join(process.cwd(), "public", categoryOld.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      updateData.image = `/uploads/category/${fileName}`;
    }

    const category = await Category.findByIdAndUpdate(categoryId, updateData, { new: true, runValidators: true });
    if (!category) return new Response(JSON.stringify({ success: false, message: "Category not found" }), { status: 404 });

    return new Response(JSON.stringify({ success: true, category: formatCategory(category) }), { status: 200 });
  } catch (error) {
    console.error("❌ PUT error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

// DELETE category
export async function DELETE(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) return new Response(JSON.stringify({ success: false, message: authResult.error }), { status: authResult.status });

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    if (!categoryId) return new Response(JSON.stringify({ success: false, message: "Category ID is required" }), { status: 400 });

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) return new Response(JSON.stringify({ success: false, message: "Category not found" }), { status: 404 });

    // Delete image file if exists
    if (category.image) {
      const imgPath = path.join(process.cwd(), "public", category.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    return new Response(JSON.stringify({ success: true, category: formatCategory(category), message: "Category deleted" }), { status: 200 });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
