import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import Store from "../../../models/Store";
import { requireAuth } from "../../../middleware/auth";
import fs from "fs";
import path from "path";

// Helper to format store for response
function formatStore(store) {
  return {
    _id: store._id.toString(),
    name: store.name,
    location: store.location,
    image: store.image || "",
    contact_email: store.contact_email || "",
    contact_phone: store.contact_phone || "",
    user_id: store.user_id,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
}

// ==================== GET ====================
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId"); // Filter by owner

    if (id) {
      const store = await Store.findById(id).populate("user_id", "name email");
      if (!store) return new Response(JSON.stringify({ success: false, message: "Store not found" }), { status: 404 });
      return new Response(JSON.stringify({ success: true, store: formatStore(store) }), { status: 200 });
    }

    const query = {};
    if (userId) {
      const isValid = mongoose.Types.ObjectId.isValid(userId);
      query.$or = [
        { user_id: userId },
        ...(isValid ? [{ user_id: new mongoose.Types.ObjectId(userId) }] : [])
      ];
    }

    const stores = await Store.find(query).populate("user_id", "name").sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, stores: stores.map(formatStore) }), { status: 200 });
  } catch (err) {
    console.error("GET /store error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

// ==================== POST ====================
export async function POST(req) {
  try {
    await connectDB();

    const auth = requireAuth(req, ["admin", "owner"]);
    if (!auth || !auth.user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }
    const user = auth.user;

    const { name, location = "", image = "", contact_email = "", contact_phone = "" } = await req.json();
    if (!name) return new Response(JSON.stringify({ success: false, message: "Name is required" }), { status: 400 });

    // Handle image upload
    let savedImage = "";
    if (image && image.startsWith("data:image")) {
      const uploadDir = path.join(process.cwd(), "public/uploads/store");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const buffer = Buffer.from(image.split(",")[1], "base64");
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      savedImage = `/uploads/store/${fileName}`;
    }

    const store = await Store.create({
      name,
      location,
      image: savedImage,
      contact_email,
      contact_phone,
      user_id: new mongoose.Types.ObjectId(user.id || user._id),
    });

    return new Response(JSON.stringify({ success: true, store: formatStore(store) }), { status: 201 });
  } catch (err) {
    console.error("POST /store error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

// ==================== PUT ====================
export async function PUT(req) {
  try {
    await connectDB();

    const auth = requireAuth(req, ["admin", "owner"]);
    if (!auth || !auth.user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    const { id, name, location = "", image = "", contact_email = "", contact_phone = "" } = await req.json();
    if (!id) return new Response(JSON.stringify({ success: false, message: "Store ID required" }), { status: 400 });
    if (!name) return new Response(JSON.stringify({ success: false, message: "Name is required" }), { status: 400 });

    const store = await Store.findById(id);
    if (!store) return new Response(JSON.stringify({ success: false, message: "Store not found" }), { status: 404 });

    // Handle image update
    let savedImage = store.image || "";
    if (image && image.startsWith("data:image")) {
      const uploadDir = path.join(process.cwd(), "public/uploads/store");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      // Delete old image if exists
      if (savedImage) {
        const oldPath = path.join(process.cwd(), "public", savedImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const buffer = Buffer.from(image.split(",")[1], "base64");
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      savedImage = `/uploads/store/${fileName}`;
    }

    store.name = name;
    store.location = location;
    store.image = savedImage;
    store.contact_email = contact_email;
    store.contact_phone = contact_phone;

    const updated = await store.save();
    return new Response(JSON.stringify({ success: true, store: formatStore(updated) }), { status: 200 });
  } catch (err) {
    console.error("PUT /store error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

// ==================== DELETE ====================
export async function DELETE(req) {
  try {
    await connectDB();

    const auth = requireAuth(req, ["admin", "owner"]);
    if (!auth || !auth.user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ success: false, message: "Store ID required" }), { status: 400 });

    const store = await Store.findById(id);
    if (!store) return new Response(JSON.stringify({ success: false, message: "Store not found" }), { status: 404 });

    // Delete image file if exists
    if (store.image) {
      const imgPath = path.join(process.cwd(), "public", store.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Store.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true, message: "Deleted" }), { status: 200 });
  } catch (err) {
    console.error("DELETE /store error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
