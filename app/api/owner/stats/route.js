import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";
import Order from "../../../models/Order";
import { requireAuth } from "../../../middleware/auth";

export async function GET(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["owner"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const ownerId = authResult.user.id;

    // Fetch owner's products
    const myProducts = await Product.find({ owner: ownerId })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const totalProducts = myProducts.length;
    const totalStock = myProducts.reduce((sum, p) => sum + p.stock, 0);

    // Get orders containing owner's products
    // Note: We filter for paid orders to count sales
    const orders = await Order.find({
      "items.product": { $in: myProducts.map(p => p._id) },
      status: { $in: ["paid", "shipped", "delivered"] }
    });

    let totalSales = 0;
    const ownerProductIds = myProducts.map(p => p._id.toString());
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (ownerProductIds.includes(item.product.toString())) {
          totalSales += item.price * item.quantity;
        }
      });
    });

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalProducts,
          totalStock,
          totalSales,
          totalOrders: orders.length,
        },
        products: myProducts
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Owner stats error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
