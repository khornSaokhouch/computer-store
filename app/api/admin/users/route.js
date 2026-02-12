import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import { requireAuth } from "../../../middleware/auth";

// GET all users
export async function GET(req) {
  try {
    await connectDB();

    const authResult = requireAuth(req, ["admin"]);
    if (authResult.error) {
      return new Response(
        JSON.stringify({ success: false, message: authResult.error }),
        { status: authResult.status }
      );
    }

    const users = await User.find().select("-password").sort("-createdAt");

    return new Response(
      JSON.stringify({ success: true, users }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// PUT update user role
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

    const { userId, role } = await req.json();

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, user }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// DELETE user
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
    const userId = searchParams.get("userId");

    await User.findByIdAndDelete(userId);

    return new Response(
      JSON.stringify({ success: true, message: "User deleted" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
