import { connectDB } from "../../../lib/mongodb";
import Brand from "../../../models/Brand";
import { requireAuth } from "../../../middleware/auth";

// GET all brands or single brand (public)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");

    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return new Response(
          JSON.stringify({ success: false, message: "Brand not found" }),
          { status: 404 }
        );
      }
      return new Response(JSON.stringify({ success: true, brand }), { status: 200 });
    } else {
      const brands = await Brand.find().sort({ name: 1 });
      return new Response(JSON.stringify({ success: true, brands }), { status: 200 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// POST create brand (admin only)
export async function POST(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const { name } = await req.json();
    if (!name) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand name is required" }),
        { status: 400 }
      );
    }

    const exists = await Brand.findOne({ name });
    if (exists) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand already exists" }),
        { status: 400 }
      );
    }

    const newBrand = await Brand.create({ name });
    return new Response(JSON.stringify({ success: true, brand: newBrand }), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// PUT update brand (admin only)
export async function PUT(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const { brandId, name } = await req.json();
    if (!brandId || !name) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand ID and name are required" }),
        { status: 400 }
      );
    }

    const brand = await Brand.findByIdAndUpdate(brandId, { name }, { new: true });
    if (!brand) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, brand }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// DELETE brand (admin only)
export async function DELETE(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");
    if (!brandId) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand ID is required" }),
        { status: 400 }
      );
    }

    const brand = await Brand.findByIdAndDelete(brandId);
    if (!brand) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, message: "Brand deleted" }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
