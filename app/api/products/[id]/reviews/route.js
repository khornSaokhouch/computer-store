import { connectDB } from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import { requireAuth } from "../../../../middleware/auth";

// POST add review
export async function POST(req, { params }) {
  try {
    await connectDB();

    const authResult = requireAuth(req);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return new Response(
        JSON.stringify({ success: false, message: "Rating and comment are required" }),
        { status: 400 }
      );
    }

    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found" }),
        { status: 404 }
      );
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (r) => r.user.toString() === authResult.user.id
    );

    if (existingReview) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You already reviewed this product",
        }),
        { status: 400 }
      );
    }

    const review = {
      user: authResult.user.id,
      userName: authResult.user.name || authResult.user.email,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    return new Response(JSON.stringify({ success: true, product }), {
      status: 201,
    });
  } catch (error) {
    console.error("Review POST error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// PUT reply to review (Owner/Admin only)
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["owner", "admin"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const { reviewId, reply } = await req.json();

    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found" }),
        { status: 404 }
      );
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return new Response(
        JSON.stringify({ success: false, message: "Review not found" }),
        { status: 404 }
      );
    }

    review.reply = reply;
    await product.save();

    return new Response(JSON.stringify({ success: true, product }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// DELETE review (Admin only)
export async function DELETE(req, { params }) {
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
    const reviewId = searchParams.get("reviewId");

    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found" }),
        { status: 404 }
      );
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    product.numReviews = product.reviews.length;

    // Recalculate rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = totalRating / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    return new Response(JSON.stringify({ success: true, product }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
