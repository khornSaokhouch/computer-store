// import { connectDB } from "../../../lib/mongodb";
// import Product from "../../../models/Product";
// import Order from "../../../models/Order";
// import { requireAuth } from "../../../middleware/auth";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const authResult = requireAuth(req, ["owner"]);
//     if (authResult.error) {
//       return new Response(
//         JSON.stringify({ success: false, message: authResult.error }),
//         { status: authResult.status }
//       );
//     }

//     const myProducts = await Product.find({ owner: authResult.user.id });
//     const totalProducts = myProducts.length;
//     const totalStock = myProducts.reduce((sum, p) => sum + p.stock, 0);

//     // Get orders containing owner's products
//     const productIds = myProducts.map(p => p._id);
//     const orders = await Order.find({
//       "items.product": { $in: productIds },
//       paymentStatus: "Paid"
//     });

//     let totalSales = 0;
//     orders.forEach(order => {
//       order.items.forEach(item => {
//         if (productIds.some(id => id.toString() === item.product.toString())) {
//           totalSales += item.price * item.quantity;
//         }
//       });
//     });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         stats: {
//           totalProducts,
//           totalStock,
//           totalSales,
//           totalOrders: orders.length,
//         },
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, message: error.message }),
//       { status: 500 }
//     );
//   }
// }
