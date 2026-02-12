// app/api/paymentAccounts/route.js
import { connectDB } from "../../../lib/mongodb";
import PaymentAccount from "../../../models/PaymentAccount";
import User from "../../../models/User";
import { requireAuth } from "../../../middleware/auth";

export async function GET(req) {
  try {
    await connectDB();

    const { user, error, status } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Case 1: Fetch single account (Publicly available for checkout reference, ignoring owner check)
    if (id) {
       const account = await PaymentAccount.findById(id);
       if (!account) return new Response(JSON.stringify({ success: false, message: "Account not found" }), { status: 404 });
       return new Response(JSON.stringify({ success: true, account }), { status: 200 });
    }

    // Case 2: List accounts (Filtered by owner for non-admin)
    // Fetch payment accounts for the logged-in user
    const query = user.role === 'admin' 
      ? (id || !searchParams.get("userId") ? {} : { owner: searchParams.get("userId") }) 
      : { owner: user.id }; 

    // Use the dynamic query
    const accounts = await PaymentAccount.find(query)
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify({ success: true, accounts }), { status: 200 });
  } catch (err) {
    console.error("GET /paymentAccounts error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { user, error, status } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status });

    const body = await req.json();
    const { userName, accountId, type, city, ownerId } = body;

    if (!userName || !accountId || !type || !city) {
      return new Response(JSON.stringify({ success: false, message: "All fields are required" }), { status: 400 });
    }

    const existing = await PaymentAccount.findOne({ accountId });
    if (existing) {
      return new Response(JSON.stringify({ success: false, message: "Account ID already exists" }), { status: 400 });
    }

    const accountOwner = (user.role === 'admin' && ownerId) ? ownerId : user.id;

    const account = await PaymentAccount.create({ 
      userName, 
      accountId, 
      type, 
      city,
      owner: accountOwner  // <-- link to user or specified owner
    });

    return new Response(JSON.stringify({ success: true, account }), { status: 201 });
  } catch (err) {
    console.error("POST /paymentAccounts error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { user, error, status } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status });

    const { id, userName, accountId, type, city, ownerId } = await req.json();
    
    if (!id) return new Response(JSON.stringify({ success: false, message: "ID is required" }), { status: 400 });

    const query = user.role === 'admin' ? { _id: id } : { _id: id, owner: user.id };
    const account = await PaymentAccount.findOne(query);
    
    if (!account) return new Response(JSON.stringify({ success: false, message: "Account not found" }), { status: 404 });

    account.userName = userName || account.userName;
    account.accountId = accountId || account.accountId;
    account.type = type || account.type;
    account.city = city || account.city;
    
    if (user.role === 'admin' && ownerId) {
      account.owner = ownerId;
    }

    await account.save();

    return new Response(JSON.stringify({ success: true, account }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { user, error, status } = requireAuth(req);
    if (error) return new Response(JSON.stringify({ success: false, message: error }), { status });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ success: false, message: "ID is required" }), { status: 400 });

    const query = user.role === 'admin' ? { _id: id } : { _id: id, owner: user.id };
    const account = await PaymentAccount.findOneAndDelete(query);
    
    if (!account) return new Response(JSON.stringify({ success: false, message: "Account not found" }), { status: 404 });

    return new Response(JSON.stringify({ success: true, message: "Deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
