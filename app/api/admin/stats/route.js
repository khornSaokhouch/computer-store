import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import Product from "../../../models/Product";
import Order from "../../../models/Order";
import { requireAuth } from "../../../middleware/auth";

export async function GET(req) {
  try {
    await connectDB();

    // Admin authentication
    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    // Total counts
    const [totalUsers, totalOwners, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "owner" }),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    // Total revenue (only paid orders)
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Recent orders (latest 10)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email");

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalUsers,
          totalOwners,
          totalProducts,
          totalOrders,
          totalRevenue,
          recentOrders,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ /api/admin/stats GET error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
