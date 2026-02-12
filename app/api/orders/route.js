// app/api/orders/route.js
import { connectDB } from "../../lib/mongodb";
import Order from "../../models/Order";
import Product from "../../models/Product";
import User from "../../models/User";
import PaymentAccount from "../../models/PaymentAccount";
import { requireAuth } from "../../middleware/auth";

export async function GET(req) {
  try {
    await connectDB();

    // Authenticate user
    const { user, error, status } = requireAuth(req);
    if (error) {
      return new Response(JSON.stringify({ success: false, message: error }), { status });
    }

    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId"); // fetch single order if provided

    if (orderId) {
      const order = await Order.findById(orderId)
        .populate("user", "name email")
        .populate("items.product", "name price images")
        .populate("paymentAccount");

      if (!order) {
        return new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404 });
      }

      // Check permissions: Admin, the user who placed it, or the owner of the payment account
      const isBuyer = user.id === order.user._id.toString();
      const isAdmin = user.role === "admin";
      const isOwner = user.role === "owner" && order.paymentAccount?.owner?.toString() === user.id;

      if (!isBuyer && !isAdmin && !isOwner) {
        return new Response(JSON.stringify({ success: false, message: "Forbidden" }), { status: 403 });
      }

      return new Response(JSON.stringify({ success: true, order }), { status: 200 });
    }

    // If no orderId, fetch orders based on role
    let query = {};
    if (user.role === "admin") {
      query = {};
    } else if (user.role === "owner") {
      const myAccounts = await PaymentAccount.find({ owner: user.id }).select("_id");
      const accountIds = myAccounts.map(a => a._id);
      query = { paymentAccount: { $in: accountIds } };
    } else {
      query = { user: user.id };
    }

    const orders = await Order.find(query)
      .populate("items.product", "name price images")
      .populate("user", "name email")
      .populate("paymentAccount")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
  } catch (err) {
    console.error("GET /orders error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    // Authenticate user
    const { user, error, status } = requireAuth(req);
    if (error) {
      return new Response(JSON.stringify({ success: false, message: error }), { status });
    }

    const body = await req.json();
    const { items, shippingAddress, paymentMethod, paymentAccountId, status: orderStatus } = body;

    // Validation
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "Cart is empty" }), { status: 400 });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return new Response(JSON.stringify({ success: false, message: "Invalid shipping address" }), { status: 400 });
    }

    // Compute total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await Order.create({
      user: user.id, // user.id from JWT
      items,
      total,
      shippingAddress,
      paymentMethod,
      paymentAccount: paymentAccountId,
      status: orderStatus || "pending",
    });

    return new Response(JSON.stringify({ success: true, order }), { status: 201 });
  } catch (err) {
    console.error("POST /orders error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();

    const { user, error, status: authStatus } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status: authStatus });

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return new Response(JSON.stringify({ success: false, message: "Order ID and status required" }), { status: 400 });
    }

    const order = await Order.findById(orderId).populate("paymentAccount");
    if (!order) {
      return new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404 });
    }

    // Check permissions: Admin or the owner of the payment account
    const isAdmin = user.role === "admin";
    const isOwner = user.role === "owner" && order.paymentAccount?.owner?.toString() === user.id;

    if (!isAdmin && !isOwner) {
      return new Response(JSON.stringify({ success: false, message: "Forbidden" }), { status: 403 });
    }

    order.status = status;
    await order.save();

    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (err) {
    console.error("PATCH /orders error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
