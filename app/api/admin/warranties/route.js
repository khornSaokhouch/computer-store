import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import Warranty from "../../../models/Warranty";
import Store from "../../../models/Store";
import User from "../../../models/User";
import { requireAuth } from "../../../middleware/auth";

// Helper to format warranty response
function formatWarranty(w) {
  const store = w.store_id;
  const user = w.user_id;

  return {
    _id: w._id.toString(),
    warranty_name: w.warranty_name,
    store: store && typeof store === 'object' && store.name
      ? { _id: store._id.toString(), name: store.name } 
      : (store ? { _id: store.toString(), name: "Unknown" } : null),
    user: user && typeof user === 'object' && user.name
      ? { _id: user._id.toString(), name: user.name, email: user.email } 
      : (user ? { _id: user.toString(), name: "Unknown" } : null),
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  };
}

// ==================== GET ====================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const warrantyId = searchParams.get("warrantyId");
    const userId = searchParams.get("userId"); // Filter by owner

    // Single warranty
    if (warrantyId) {
      const warranty = await Warranty.findById(warrantyId)
        .populate("store_id", "name")
        .populate("user_id", "name email");

      if (!warranty) {
        return new Response(
          JSON.stringify({ success: false, message: "Warranty not found" }),
          { status: 404 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, warranty: formatWarranty(warranty) }),
        { status: 200 }
      );
    }

    const query = {};
    if (userId) {
      const isValid = mongoose.Types.ObjectId.isValid(userId);
      query.$or = [
        { user_id: userId },
        ...(isValid ? [{ user_id: new mongoose.Types.ObjectId(userId) }] : [])
      ];
    }

    // All warranties (filtered)
    const warranties = await Warranty.find(query)
      .populate("store_id", "name")
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({ success: true, warranties: warranties.map(formatWarranty) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /warranties error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}


// ==================== POST (create warranty) ====================
export async function POST(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin", "owner"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const {
      store_id,
      warranty_name,
      start_date,
      end_date,
      status = "active",
    } = await req.json();

    if (!store_id || !warranty_name || !start_date || !end_date) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Find the store to get its owner
    const storeObj = await Store.findById(store_id);
    if (!storeObj) {
      return new Response(
        JSON.stringify({ success: false, message: "Store not found" }),
        { status: 404 }
      );
    }

    const warranty = await Warranty.create({
      store_id: new mongoose.Types.ObjectId(store_id),
      user_id: storeObj.user_id, // Assigned to store owner
      warranty_name,
      start_date,
      end_date,
      status,
    });

    // Populate for consistent response format
    await warranty.populate("store_id", "name");
    await warranty.populate("user_id", "name email");

    return new Response(JSON.stringify({ success: true, warranty: formatWarranty(warranty) }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// ==================== PUT (update warranty) ====================
export async function PUT(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin", "owner"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const {
      warrantyId,
      store_id,
      warranty_name,
      start_date,
      end_date,
      status,
    } = await req.json();

    if (!warrantyId) {
      return new Response(
        JSON.stringify({ success: false, message: "Warranty ID is required" }),
        { status: 400 }
      );
    }

    const warranty = await Warranty.findById(warrantyId);
    if (!warranty) {
      return new Response(
        JSON.stringify({ success: false, message: "Warranty not found" }),
        { status: 404 }
      );
    }

    if (store_id) {
      const storeObj = await Store.findById(store_id);
      if (storeObj) {
        warranty.store_id = new mongoose.Types.ObjectId(store_id);
        warranty.user_id = storeObj.user_id;
      }
    }

    warranty.warranty_name = warranty_name ?? warranty.warranty_name;
    warranty.start_date = start_date ?? warranty.start_date;
    warranty.end_date = end_date ?? warranty.end_date;
    warranty.status = status ?? warranty.status;

    await warranty.save();

    // Populate for consistent response format
    await warranty.populate("store_id", "name");
    await warranty.populate("user_id", "name email");

    return new Response(JSON.stringify({ success: true, warranty: formatWarranty(warranty) }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// ==================== DELETE (delete warranty) ====================
export async function DELETE(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin", "owner"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const warrantyId = searchParams.get("warrantyId");

    if (!warrantyId) {
      return new Response(
        JSON.stringify({ success: false, message: "Warranty ID is required" }),
        { status: 400 }
      );
    }

    const warranty = await Warranty.findByIdAndDelete(warrantyId);
    if (!warranty) {
      return new Response(
        JSON.stringify({ success: false, message: "Warranty not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Warranty deleted" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
