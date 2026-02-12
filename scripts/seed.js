// Run this script to seed the database with sample data
// Usage: node scripts/seed.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB connection
const MONGODB_URI = "mongodb+srv://chensreyneat198_db_user:Cz8LR4cDpj3m7U5P@data.whwqurx.mongodb.net/computerstore?retryWrites=true&w=majority";

// Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  price: Number,
  stock: Number,
  description: String,
  specifications: Map,
  images: [String],
  warranty: String,
  rating: Number,
  reviews: Array,
  featured: Boolean,
  owner: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@techstore.com",
      password: hashedPassword,
      role: "admin",
    });

    const owner = await User.create({
      name: "Store Owner",
      email: "owner@techstore.com",
      password: hashedPassword,
      role: "owner",
    });

    const user = await User.create({
      name: "John Doe",
      email: "user@techstore.com",
      password: hashedPassword,
      role: "user",
    });

    console.log("✅ Created users:");
    console.log("   - admin@techstore.com / password123 (Admin)");
    console.log("   - owner@techstore.com / password123 (Owner)");
    console.log("   - user@techstore.com / password123 (User)");

    // Create sample products
    const products = [
      {
        name: "Dell XPS 15",
        brand: "Dell",
        category: "Laptops",
        price: 1299,
        stock: 15,
        description: "High-performance laptop with stunning display and powerful specs",
        specifications: new Map([
          ["Processor", "Intel Core i7-11800H"],
          ["RAM", "16GB DDR4"],
          ["Storage", "512GB SSD"],
          ["Display", "15.6\" FHD"],
          ["Graphics", "NVIDIA GTX 1650"],
        ]),
        images: ["https://via.placeholder.com/400x300?text=Dell+XPS+15"],
        warranty: "2 Years",
        rating: 4.5,
        reviews: [],
        featured: true,
        owner: owner._id,
      },
      {
        name: "MacBook Pro 16",
        brand: "Apple",
        category: "Laptops",
        price: 2499,
        stock: 8,
        description: "Professional laptop with M2 chip and stunning Retina display",
        specifications: new Map([
          ["Processor", "Apple M2 Pro"],
          ["RAM", "16GB Unified Memory"],
          ["Storage", "512GB SSD"],
          ["Display", "16\" Retina"],
          ["Battery", "Up to 22 hours"],
        ]),
        images: ["https://via.placeholder.com/400x300?text=MacBook+Pro+16"],
        warranty: "1 Year",
        rating: 4.8,
        reviews: [],
        featured: true,
        owner: owner._id,
      },
      {
        name: "HP Pavilion Desktop",
        brand: "HP",
        category: "Desktop PCs",
        price: 899,
        stock: 12,
        description: "Powerful desktop PC for work and entertainment",
        specifications: new Map([
          ["Processor", "Intel Core i5-12400"],
          ["RAM", "16GB DDR4"],
          ["Storage", "1TB HDD + 256GB SSD"],
          ["Graphics", "Intel UHD Graphics"],
          ["OS", "Windows 11"],
        ]),
        images: ["https://via.placeholder.com/400x300?text=HP+Pavilion"],
        warranty: "1 Year",
        rating: 4.2,
        reviews: [],
        featured: false,
        owner: owner._id,
      },
      {
        name: "Logitech MX Master 3",
        brand: "Logitech",
        category: "Computer Accessories",
        price: 99,
        stock: 50,
        description: "Advanced wireless mouse for productivity",
        specifications: new Map([
          ["Connectivity", "Bluetooth & USB"],
          ["Battery", "Up to 70 days"],
          ["DPI", "4000"],
          ["Buttons", "7 programmable"],
        ]),
        images: ["https://via.placeholder.com/400x300?text=MX+Master+3"],
        warranty: "1 Year",
        rating: 4.7,
        reviews: [],
        featured: false,
        owner: owner._id,
      },
      {
        name: "Mechanical Keyboard RGB",
        brand: "Corsair",
        category: "Computer Accessories",
        price: 149,
        stock: 30,
        description: "Gaming mechanical keyboard with RGB lighting",
        specifications: new Map([
          ["Switch Type", "Cherry MX Red"],
          ["Backlight", "RGB"],
          ["Connection", "USB"],
          ["Layout", "Full-size"],
        ]),
        images: ["https://via.placeholder.com/400x300?text=Corsair+Keyboard"],
        warranty: "2 Years",
        rating: 4.6,
        reviews: [],
        featured: false,
        owner: owner._id,
      },
      {
        name: "NVIDIA RTX 4070",
        brand: "NVIDIA",
        category: "Components",
        price: 599,
        stock: 10,
        description: "High-performance graphics card for gaming and content creation",
        specifications: new Map([
          ["Memory", "12GB GDDR6X"],
          ["CUDA Cores", "5888"],
          ["Boost Clock", "2.48 GHz"],
          ["Power", "200W"],
        ]),
        images: ["https://via.placeholder.com/400x300?text=RTX+4070"],
        warranty: "3 Years",
        rating: 4.9,
        reviews: [],
        featured: true,
        owner: owner._id,
      },
      {
        name: "Samsung 27\" Monitor",
        brand: "Samsung",
        category: "Computer Accessories",
        price: 299,
        stock: 25,
        description: "4K UHD monitor with HDR support",
        specifications: new Map([
          ["Size", "27 inches"],
          ["Resolution", "3840x2160"],
          ["Refresh Rate", "60Hz"],
          ["Panel Type", "IPS"],
          ["HDR", "HDR10"],
        ]),
        images: ["https://via.placeholder.com/400x300?text=Samsung+Monitor"],
        warranty: "1 Year",
        rating: 4.4,
        reviews: [],
        featured: false,
        owner: owner._id,
      },
      {
        name: "AMD Ryzen 9 5900X",
        brand: "AMD",
        category: "Components",
        price: 449,
        stock: 18,
        description: "12-core processor for high-performance computing",
        specifications: new Map([
          ["Cores", "12"],
          ["Threads", "24"],
          ["Base Clock", "3.7 GHz"],
          ["Boost Clock", "4.8 GHz"],
          ["TDP", "105W"],
        ]),
        images: ["https://via.placeholder.com/400x300?text=Ryzen+9"],
        warranty: "3 Years",
        rating: 4.8,
        reviews: [],
        featured: true,
        owner: owner._id,
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} sample products`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📝 You can now login with:");
    console.log("   Admin: admin@techstore.com / password123");
    console.log("   Owner: owner@techstore.com / password123");
    console.log("   User: user@techstore.com / password123");

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
