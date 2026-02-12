import { connectDB } from "../../../lib/mongodb";
import Type from "../../../models/Type";
import { requireAuth } from "../../../middleware/auth";

// ==================== GET Types ====================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const typeId = searchParams.get("typeId");
    const categoryId = searchParams.get("categoryId");

    // Fetch single type by ID
    if (typeId) {
      const type = await Type.findById(typeId).populate("category_id", "category_name");
      if (!type) {
        return new Response(
          JSON.stringify({ success: false, message: "Type not found" }),
          { status: 404 }
        );
      }
      return new Response(JSON.stringify({ success: true, type }), { status: 200 });
    }

    // Fetch types by category
    if (categoryId) {
      const types = await Type.find({ category_id: categoryId }).populate("category_id", "category_name");
      return new Response(JSON.stringify({ success: true, types }), { status: 200 });
    }

    // Fetch all types
    const types = await Type.find().populate("category_id", "category_name").sort({ type_name: 1 });
    return new Response(JSON.stringify({ success: true, types }), { status: 200 });

  } catch (error) {
    console.error("GET /types error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// ==================== POST Create Type ====================
export async function POST(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(JSON.stringify({ success: false, message: authResult.error }), { status: authResult.status });
    }

    const { type_name, category_id, description } = await req.json();

    if (!type_name || !category_id) {
      return new Response(JSON.stringify({ success: false, message: "Type name and category are required" }), { status: 400 });
    }

    const exists = await Type.findOne({ type_name, category_id });
    if (exists) {
      return new Response(JSON.stringify({ success: false, message: "Type already exists in this category" }), { status: 400 });
    }

    const newType = await Type.create({ type_name, category_id, description });
    return new Response(JSON.stringify({ success: true, type: newType }), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

// ==================== PUT Update Type ====================
export async function PUT(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(JSON.stringify({ success: false, message: authResult.error }), { status: authResult.status });
    }

    const { typeId, type_name, category_id, description } = await req.json();

    if (!typeId || !type_name || !category_id) {
      return new Response(JSON.stringify({ success: false, message: "Type ID, name, and category are required" }), { status: 400 });
    }

    const type = await Type.findByIdAndUpdate(typeId, { type_name, category_id, description }, { new: true });
    if (!type) {
      return new Response(JSON.stringify({ success: false, message: "Type not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, type }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

// ==================== DELETE Type ====================
export async function DELETE(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(JSON.stringify({ success: false, message: authResult.error }), { status: authResult.status });
    }

    const { searchParams } = new URL(req.url);
    const typeId = searchParams.get("typeId");

    if (!typeId) {
      return new Response(JSON.stringify({ success: false, message: "Type ID is required" }), { status: 400 });
    }

    await Type.findByIdAndDelete(typeId);
    return new Response(JSON.stringify({ success: true, message: "Type deleted" }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
