import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Favorite from "../../models/Favorite";
import Product from "../../models/Product";
import Brand from "../../models/Brand";
import { requireAuth } from "../../middleware/auth";

// ===== GET USER FAVORITES =====
// ===== GET USER FAVORITES =====
export async function GET(req) {
  try {
    await connectDB();

    const { user } = requireAuth(req); // throws if unauthorized
    if (!user?.id) throw new Error("Unauthorized");

    // Populate product AND brand
    const favorites = await Favorite.find({ user: user.id }).populate({
      path: "product",
      populate: { path: "brand", select: "name" }, // 🔹 populate brand name
    });

    return NextResponse.json({ success: true, favorites });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}



// ===== ADD FAVORITE =====
export async function POST(req) {
  try {
    await connectDB();

    const auth = requireAuth(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const user = auth.user;
    const body = await req.json();

    if (!body.product)
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });

    // Check if favorite already exists
    const existing = await Favorite.findOne({ user: user.id, product: body.product });
    if (existing)
      return NextResponse.json({ success: false, message: "Already in favorites" }, { status: 400 });

    const favorite = await Favorite.create({ user: user.id, product: body.product });
    const populatedFavorite = await Favorite.findById(favorite._id).populate("product");

    return NextResponse.json({ success: true, favorite: populatedFavorite }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ===== DELETE FAVORITE =====
export async function DELETE(req) {
  try {
    await connectDB();

    const auth = requireAuth(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const user = auth.user;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ success: false, message: "Favorite ID required" }, { status: 400 });

    const deleted = await Favorite.findOneAndDelete({ _id: id, user: user.id });
    if (!deleted)
      return NextResponse.json({ success: false, message: "Favorite not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
