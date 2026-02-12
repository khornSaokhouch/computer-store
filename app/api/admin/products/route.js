import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";
import { requireAuth } from "../../../middleware/auth";
import fs from "fs";
import path from "path";

// ✅ REGISTER ALL POPULATED MODELS
import "../../../models/User";
import "../../../models/Store";
import "../../../models/Brand";
import Category from "../../../models/Category";
import "../../../models/Type";
import "../../../models/PaymentAccount";
import "../../../models/Warranty";

function formatProduct(product) {
  return {
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    category: product.category,
    type: product.type || "",
    brand: product.brand,
    store_id: product.store_id || null, // <-- include store
    paymentAccount: product.paymentAccount || null,
    description: product.description,
    stock: product.stock || 0,
    warranty: product.warranty || null,
    images: product.images || [],
    rating: product.rating || 0,
    numReviews: product.numReviews || 0,
    reviews: product.reviews || [],
    owner: product.owner,
    createdAt: product.createdAt,
  };
}

// ==================== GET (PUBLIC / FILTERABLE) ====================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");             // single product
    const search = searchParams.get("search") || ""; // product name search
    const category = searchParams.get("category") || "";
    const store = searchParams.get("store") || "";
    const userId = searchParams.get("userId") || ""; // NEW: filter by owner/user
    const brand = searchParams.get("brand") || ""; // NEW: filter by brand
    const type = searchParams.get("type") || ""; // NEW: filter by type

    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const catObj = await Category.findOne({ category_name: category });
        if (catObj) {
          query.category = catObj._id;
        } else {
          // If category name doesn't exist, return no results
          query.category = new mongoose.Types.ObjectId(); 
        }
      }
    }
    if (store) query.store_id = store;
    if (brand) {
      if (mongoose.Types.ObjectId.isValid(brand)) {
        query.brand = brand;
      } else {
        const brandObj = await mongoose.model("Brand").findOne({ name: brand });
        if (brandObj) {
          query.brand = brandObj._id;
        } else {
          // If brand name doesn't exist, return no results
          query.brand = new mongoose.Types.ObjectId(); 
        }
      }
    }
    if (type) {
      if (mongoose.Types.ObjectId.isValid(type)) {
        query.type = type;
      } else {
        const typeObj = await mongoose.model("Type").findOne({ type_name: type });
        if (typeObj) {
          query.type = typeObj._id;
        } else {
          // If type name doesn't exist, return no results
          query.type = new mongoose.Types.ObjectId(); 
        }
      }
    }
    if (userId) {
      const isValid = mongoose.Types.ObjectId.isValid(userId);
      query.$or = [
        { owner: userId },
        ...(isValid ? [{ owner: new mongoose.Types.ObjectId(userId) }] : [])
      ];
    }

    // 🔹 SINGLE PRODUCT
    if (id) {
      const product = await Product.findById(id)
        .populate("owner", "name email")
        .populate("store_id", "name")
        .populate("brand", "name")
        .populate("category", "category_name")
        .populate("type", "type_name")
        .populate("warranty", "warranty_name")
        .populate({ path: "paymentAccount", select: "userName accountId type", strictPopulate: false });

      if (!product)
        return new Response(
          JSON.stringify({ success: false, message: "Product not found" }),
          { status: 404 }
        );

      return new Response(
        JSON.stringify({ success: true, product: formatProduct(product) }),
        { status: 200 }
      );
    }

    // 🔹 PRODUCT LIST (PUBLIC / FILTERED)
    const products = await Product.find(query)
      .populate("owner", "name email")
      .populate("store_id", "name")
      .populate("brand", "name")
      .populate("category", "category_name")
      .populate("type", "type_name")
      .populate("warranty", "warranty_name")
      .populate({ path: "paymentAccount", select: "userName accountId type", strictPopulate: false })
      .sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({
        success: true,
        products: products.map(formatProduct),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /products error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}


// ==================== POST ====================
export async function POST(req) {
  try {
    await connectDB();

    const auth = requireAuth(req, ["admin", "owner"]);
    if (auth.error)
      return new Response(
        JSON.stringify({ success: false, message: auth.error }),
        { status: auth.status }
      );

    const user = auth.user;
    if (!user)
      return new Response(
        JSON.stringify({ success: false, message: "User not authenticated" }),
        { status: 401 }
      );

    const {
      name,
      price,
      category,
      type,
      brand,
      store_id, // <-- required
      paymentAccount, // <-- extract
      description = "",
      imagesBase64 = [],
      stock = 0,
      warranty = "1 Year",
    } = await req.json();

    if (!name || !price || !category || !type || !brand || !store_id)
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );

    // Save images
    const savedImages = [];
    if (Array.isArray(imagesBase64)) {
      const uploadDir = path.join(process.cwd(), "public/uploads/products");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      for (let base64 of imagesBase64) {
        if (!base64.startsWith("data:image")) continue;
        const buffer = Buffer.from(base64.split(",")[1], "base64");
        const fileName = `${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}.png`;
        fs.writeFileSync(path.join(uploadDir, fileName), buffer);
        savedImages.push(`/uploads/products/${fileName}`);
      }
    }

    const product = await Product.create({
      name,
      price,
      category: new mongoose.Types.ObjectId(category),
      type: new mongoose.Types.ObjectId(type),
      brand: new mongoose.Types.ObjectId(brand),
      store_id: new mongoose.Types.ObjectId(store_id), 
      paymentAccount: paymentAccount ? new mongoose.Types.ObjectId(paymentAccount) : null, // <-- save
      description,
      stock,
      warranty: warranty ? new mongoose.Types.ObjectId(warranty) : null,
      images: savedImages,
      owner: new mongoose.Types.ObjectId(user.id),
    });

    return new Response(
      JSON.stringify({ success: true, product: formatProduct(product) }),
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /products error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500 }
    );
  }
}

// ==================== PUT ====================
export async function PUT(req) {
  try {
    await connectDB();

    const auth = requireAuth(req, ["admin", "owner"]);
    if (!auth || !auth.user)
      return new Response(
        JSON.stringify({ success: false, message: "User not authenticated" }),
        { status: 401 }
      );

    const {
      id,
      name,
      price,
      category,
      type,
      brand,
      store_id,
      paymentAccount, // <-- extract
      description = "",
      imagesBase64 = [],
      existingImages = [],
      stock = 0,
      warranty = "1 Year",
    } = await req.json();

    if (!id || !name || !price || !category || !type || !brand || !store_id)
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );

    const product = await Product.findById(id);
    if (!product)
      return new Response(
        JSON.stringify({ success: false, message: "Product not found" }),
        { status: 404 }
      );

    const updateData = {
      name,
      price,
      category: new mongoose.Types.ObjectId(category),
      type: new mongoose.Types.ObjectId(type),
      brand: new mongoose.Types.ObjectId(brand),
      store_id: new mongoose.Types.ObjectId(store_id), 
      paymentAccount: paymentAccount ? new mongoose.Types.ObjectId(paymentAccount) : null, // <-- update
      description,
      stock,
      warranty: warranty ? new mongoose.Types.ObjectId(warranty) : null,
    };

    // Save new images
    const savedNewImages = [];
    const uploadDir = path.join(process.cwd(), "public/uploads/products");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    for (let base64 of imagesBase64) {
      if (!base64.startsWith("data:image")) continue;
      const buffer = Buffer.from(base64.split(",")[1], "base64");
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      savedNewImages.push(`/uploads/products/${fileName}`);
    }

    // Delete old images not kept
    const imagesToDelete = product.images.filter(
      (img) => !existingImages.includes(img)
    );
    for (let img of imagesToDelete) {
      const imgPath = path.join(process.cwd(), "public", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    updateData.images = [...existingImages, ...savedNewImages];

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return new Response(
      JSON.stringify({ success: true, product: formatProduct(updated) }),
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /products error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500 }
    );
  }
}

// ==================== DELETE ====================
export async function DELETE(req) {
  try {
    await connectDB();

    const auth = requireAuth(req, ["admin", "owner"]);
    if (auth.error)
      return new Response(
        JSON.stringify({ success: false, message: auth.error }),
        { status: auth.status }
      );

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return new Response(
        JSON.stringify({ success: false, message: "Product ID required" }),
        { status: 400 }
      );

    const product = await Product.findById(id);
    if (!product)
      return new Response(
        JSON.stringify({ success: false, message: "Not found" }),
        { status: 404 }
      );

    // Delete images
    for (let img of product.images || []) {
      const imgPath = path.join(process.cwd(), "public", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true, message: "Deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.error("DELETE /products error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500 }
    );
  }
}
