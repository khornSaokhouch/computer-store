import { connectDB } from "../../lib/mongodb";
import CartItem from "../../models/CartItem";
import { requireAuth } from "../../middleware/auth";
import Product from "../../models/Product";
import "../../models/PaymentAccount"; // Ensure model is registered for deep populate

export async function GET(req) {
  try {
    await connectDB();

    // Get logged-in user
    const { user, error } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status: 401 });

    // Fetch cart items for this user and populate product info
    const cartItems = await CartItem.find({ user: user.id })
      .populate({ 
        path: "product", 
        populate: { 
          path: "paymentAccount", 
          strictPopulate: false 
        } 
      });

    return new Response(JSON.stringify({ success: true, cart: cartItems }), { status: 200 });
  } catch (err) {
    console.error("GET /cart error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { user, error } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status: 401 });

    const { productId, quantity = 1 } = await req.json();
    if (!productId) return new Response(JSON.stringify({ success: false, message: "Product ID required" }), { status: 400 });

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return new Response(JSON.stringify({ success: false, message: "Product not found" }), { status: 404 });

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({ user: user.id, product: productId });
    if (cartItem) {
      // Increment quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({ user: user.id, product: productId, quantity });
    }

    return new Response(JSON.stringify({ success: true, cartItem }), { status: 201 });
  } catch (err) {
    console.error("POST /cart error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const { user, error } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status: 401 });

    const { cartItemId, quantity } = await req.json();
    if (!cartItemId || quantity == null) return new Response(JSON.stringify({ success: false, message: "Cart item ID and quantity required" }), { status: 400 });

    const cartItem = await CartItem.findOne({ _id: cartItemId, user: user.id });
    if (!cartItem) return new Response(JSON.stringify({ success: false, message: "Cart item not found" }), { status: 404 });

    if (quantity <= 0) {
      await cartItem.remove(); // remove if quantity is 0
      return new Response(JSON.stringify({ success: true, message: "Item removed from cart" }), { status: 200 });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return new Response(JSON.stringify({ success: true, cartItem }), { status: 200 });
  } catch (err) {
    console.error("PUT /cart error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const { user, error } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status: 401 });

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("id");
    const clearAll = searchParams.get("all") === "true";

    if (clearAll) {
      await CartItem.deleteMany({ user: user.id });
      return new Response(JSON.stringify({ success: true, message: "Cart cleared" }), { status: 200 });
    }

    if (!cartItemId) return new Response(JSON.stringify({ success: false, message: "Cart item ID required" }), { status: 400 });

    const deleted = await CartItem.findOneAndDelete({ _id: cartItemId, user: user.id });
    if (!deleted) return new Response(JSON.stringify({ success: false, message: "Cart item not found" }), { status: 404 });

    return new Response(JSON.stringify({ success: true, message: "Removed from cart" }), { status: 200 });
  } catch (err) {
    console.error("DELETE /cart error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
