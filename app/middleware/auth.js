import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// ===== GENERATE JWT TOKEN =====
export function generateToken(user) {
  return jwt.sign(
    { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ===== VERIFY JWT TOKEN =====
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null;
  }
}

// ===== GET USER FROM REQUEST =====
export function getUserFromRequest(req) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  const user = verifyToken(token);
  return user || null;
}

// ===== REQUIRE AUTH =====
export function requireAuth(req, allowedRoles = []) {
  const user = getUserFromRequest(req);

  if (!user) {
    return { error: "Unauthorized", status: 401, user: null };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return { error: "Forbidden", status: 403, user: null };
  }

  return { error: null, status: 200, user };
}
