# 🚀 Get Started with TechStore

Welcome! This guide will help you get your e-commerce platform up and running in minutes.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (already configured)
- A code editor (VS Code recommended)
- A web browser

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Seed Database with Sample Data (1 min)
```bash
npm run seed
```

This creates:
- 3 test accounts (admin, owner, user)
- 8 sample products
- Ready-to-use data

### Step 3: Start Development Server (1 min)
```bash
npm run dev
```

### Step 4: Open in Browser (1 min)
```
http://localhost:3000
```

### Step 5: Login and Test (1 min)
Use any of these accounts:
- **Admin**: admin@techstore.com / password123
- **Owner**: owner@techstore.com / password123
- **User**: user@techstore.com / password123

## 🎯 What You Can Do Now

### As a User
1. Browse 8 sample products
2. Search and filter products
3. Add products to cart
4. Complete checkout
5. View order history
6. Write product reviews

### As an Owner
1. View your dashboard
2. Add new products
3. Manage existing products
4. View sales statistics
5. Reply to customer reviews

### As an Admin
1. View system statistics
2. Manage all users
3. Change user roles
4. View all products
5. Manage all orders
6. Monitor revenue

## 📁 Project Structure

```
computer-store/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin pages
│   ├── owner/             # Owner pages
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   ├── middleware/        # Auth middleware
│   ├── models/            # Database models
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   └── orders/            # Order pages
├── scripts/               # Utility scripts
│   └── seed.js           # Database seeder
├── public/                # Static files
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

## 🔑 Key Features

✅ **Authentication**
- Secure JWT-based authentication
- Role-based access control
- Password hashing with bcrypt

✅ **Product Management**
- Full CRUD operations
- Image support
- Categories and brands
- Stock management
- Product reviews

✅ **Shopping Experience**
- Product search and filters
- Shopping cart
- Multiple payment methods
- Order tracking
- Invoice generation

✅ **Dashboards**
- Owner dashboard with sales stats
- Admin dashboard with system stats
- User order history

✅ **Reviews & Ratings**
- 5-star rating system
- User reviews
- Owner replies
- Average rating calculation

## 📚 Documentation

- **README.md** - Complete project documentation
- **QUICKSTART.md** - Detailed quick start guide
- **TESTING_GUIDE.md** - Comprehensive testing guide
- **DEPLOYMENT.md** - Deployment instructions
- **PROJECT_SUMMARY.md** - Feature checklist

## 🧪 Testing

### Manual Testing
Follow the **TESTING_GUIDE.md** for complete test scenarios.

### Quick Test Flow
1. Login as user
2. Add product to cart
3. Complete checkout
4. View order
5. Write review

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See **DEPLOYMENT.md** for detailed instructions.

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed database with sample data
```

### Environment Variables
Already configured in `.env.local`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key

## 📊 Database Models

### User
- name, email, password (hashed)
- role: user | owner | admin
- timestamps

### Product
- name, brand, category, price, stock
- description, specifications, images
- warranty, rating, reviews
- owner reference

### Order
- user reference, items array
- delivery info, payment method
- order status, payment status
- invoice number

## 🎨 Customization

### Change Branding
1. Update logo in `public/img/logo.png`
2. Update site name in `app/components/Navbar.jsx`
3. Update colors in `app/globals.css`

### Add Categories
1. Update enum in `app/models/Product.js`
2. Update dropdown in product forms
3. Update filter options

### Add Payment Methods
1. Update enum in `app/models/Order.js`
2. Update checkout page options
3. Integrate payment gateway

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check `.env.local` has correct URI
- Verify IP whitelist in MongoDB Atlas
- Test connection string

### JWT Token Error
- Clear browser localStorage
- Login again
- Check JWT_SECRET in `.env.local`

### Cart Not Updating
- Check browser console for errors
- Clear localStorage
- Refresh page

### Build Errors
- Delete `.next` folder
- Delete `node_modules`
- Run `npm install` again
- Run `npm run build`

## 📞 Support

### Common Issues
1. Check documentation files
2. Review error messages
3. Check browser console
4. Review API responses

### Resources
- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Tailwind CSS: https://tailwindcss.com/docs

## 🎉 Next Steps

1. ✅ **Test the application** - Try all features
2. ✅ **Customize branding** - Add your logo and colors
3. ✅ **Add real products** - Replace sample data
4. ✅ **Configure payments** - Integrate payment gateway
5. ✅ **Deploy to production** - Launch your store
6. ✅ **Add more features** - Enhance functionality

## 💡 Tips

- Use the seed script to reset data during development
- Test with different user roles
- Check the testing guide for comprehensive scenarios
- Review the deployment guide before going live
- Keep your JWT_SECRET secure
- Regular database backups

## 🏆 You're Ready!

Your e-commerce platform is fully functional and ready to use. Start by:

1. Running `npm run seed` to add sample data
2. Starting the dev server with `npm run dev`
3. Logging in with test accounts
4. Exploring all features

Happy coding! 🚀
