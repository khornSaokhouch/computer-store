import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import { generateToken } from "../../middleware/auth";

// Handle POST requests for both login and register
export async function POST(req) {
  try {
    await connectDB();

    const { type, name, email, password, confirmPassword } = await req.json();

    if (!type || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // ===== REGISTER =====
    if (type === "register") {
      if (!name || !confirmPassword) {
        return new Response(
          JSON.stringify({ success: false, message: "All fields are required" }),
          { status: 400 }
        );
      }

      if (password !== confirmPassword) {
        return new Response(
          JSON.stringify({ success: false, message: "Passwords do not match" }),
          { status: 400 }
        );
      }

      // Check existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(
          JSON.stringify({ success: false, message: "Email already exists" }),
          { status: 400 }
        );
      }

      // Hash password and save user with default role
      const hashedPassword = await bcrypt.hash(password, 10);
const newUser = new User({ name, email, password: hashedPassword, role: "user" });
await newUser.save();

      return new Response(
        JSON.stringify({ success: true, message: "User registered successfully" }),
        { status: 201 }
      );
    }

    // ===== LOGIN =====
    if (type === "login") {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid email or password" }),
          { status: 401 }
        );
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid email or password" }),
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = generateToken(user);

      // Return user info including role and token
      return new Response(
        JSON.stringify({
          success: true,
          message: "Login successful",
          token,
          user: { id: user._id, name: user.name, email: user.email, role: user.role },
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Invalid type, must be 'login' or 'register'" }),
      { status: 400 }
    );

  } catch (error) {
    console.error("❌ Auth API Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
