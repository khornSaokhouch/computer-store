// import { NextResponse } from "next/server";
// import { connectDB } from "../../../lib/mongodb";
// import User from "../../../models/User";
// import jwt from "jsonwebtoken";

// // Helper to verify token and get User ID
// const getUserIdFromRequest = (req) => {
//   const authHeader = req.headers.get("Authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  
//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded.id; // Or decoded._id depending on how you sign your tokens
//   } catch (err) {
//     return null;
//   }
// };

// // 1. GET Profile
// export async function GET(req) {
//   try {
//     await connectDB();
//     const userId = getUserIdFromRequest(req);

//     if (!userId) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const user = await User.findById(userId).select("-password"); // Don't send password

//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone || "",
//         role: user.role,
//         image: user.image || "",
//         joinedDate: user.createdAt
//       }
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

// // 2. UPDATE Profile
// export async function PUT(req) {
//   try {
//     await connectDB();
//     const userId = getUserIdFromRequest(req);

//     if (!userId) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { name, email, phone, image } = body;

//     // Optional: Check if email is already taken by another user
//     if (email) {
//       const existingUser = await User.findOne({ email, _id: { $ne: userId } });
//       if (existingUser) {
//         return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
//       }
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { 
//         name, 
//         email, 
//         phone, 
//         image // Note: If this is Base64, ensure your MongoDB limit isn't exceeded (16MB)
//       },
//       { new: true } // Return the updated document
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }