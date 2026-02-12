# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Environment Variables
Your `.env.local` is already configured with:
- MongoDB connection
- JWT secret key

## 3. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 4. Create Test Accounts

### Create a Regular User
1. Go to http://localhost:3000/register
2. Fill in the form and register
3. Login and browse products

### Create an Owner Account
1. Register a new account (e.g., owner@test.com)
2. Open MongoDB Atlas or Compass
3. Find the user in the `users` collection
4. Change the `role` field from "user" to "owner"
5. Logout and login again
6. You'll now see the Owner Dashboard

### Create an Admin Account
1. Register a new account (e.g., admin@test.com)
2. Open MongoDB Atlas or Compass
3. Find the user in the `users` collection
4. Change the `role` field from "user" to "admin"
5. Logout and login again
6. You'll now see the Admin Dashboard

## 5. Test the Features

### As Owner:
1. Login with owner account
2. Go to Owner Dashboard
3. Click "Add New Product"
4. Fill in product details:
   - Name: Dell XPS 15
   - Brand: Dell
   - Category: Laptops
   - Price: 1299
   - Stock: 10
   - Description: High-performance laptop
   - Warranty: 2 Years
   - Images: https://via.placeholder.com/400
5. Submit and view your product

### As User:
1. Login with user account
2. Browse products
3. Click on a product
4. Add to cart
5. Go to cart
6. Proceed to checkout
7. Fill delivery information
8. Choose payment method
9. Place order
10. View order in "My Orders"
11. Write a review on the product

### As Admin:
1. Login with admin account
2. View dashboard statistics
3. Manage users (change roles, delete users)
4. View all products
5. View all orders
6. Monitor revenue

## 6. API Testing with Postman/Thunder Client

### Login
```
POST http://localhost:3000/api/auth
Content-Type: application/json

{
  "type": "login",
  "email": "owner@test.com",
  "password": "your_password"
}
```

Copy the `token` from response.

### Create Product (Owner/Admin)
```
POST http://localhost:3000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "MacBook Pro 16",
  "brand": "Apple",
  "category": "Laptops",
  "price": 2499,
  "stock": 5,
  "description": "Powerful laptop for professionals",
  "warranty": "1 Year",
  "images": ["https://via.placeholder.com/400"]
}
```

### Get All Products
```
GET http://localhost:3000/api/products
```

### Get Products by Category
```
GET http://localhost:3000/api/products?category=Laptops
```

### Search Products
```
GET http://localhost:3000/api/products?search=Dell
```

## 7. Database Structure

### Users Collection
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "user" | "owner" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  name: "Dell XPS 15",
  brand: "Dell",
  category: "Laptops",
  price: 1299,
  stock: 10,
  description: "High-performance laptop",
  specifications: {},
  images: ["url1", "url2"],
  warranty: "2 Years",
  rating: 4.5,
  reviews: [],
  featured: false,
  owner: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    name: "Product Name",
    price: 1299,
    quantity: 1,
    image: "url"
  }],
  totalAmount: 1299,
  deliveryInfo: {
    fullName: "John Doe",
    phone: "123456789",
    address: "123 Street",
    city: "Phnom Penh",
    notes: "Optional notes"
  },
  paymentMethod: "COD",
  paymentStatus: "Pending",
  orderStatus: "Pending",
  invoice: {
    invoiceNumber: "INV-123",
    generatedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 8. Common Issues

### MongoDB Connection Error
- Check your MONGODB_URI in `.env.local`
- Ensure your IP is whitelisted in MongoDB Atlas
- Check network connectivity

### JWT Token Error
- Ensure JWT_SECRET is set in `.env.local`
- Clear localStorage and login again

### Cart Not Updating
- Check browser console for errors
- Clear localStorage and try again

## 9. Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
```
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=strong_random_secret_key
```

## 10. Next Steps

- Add more products
- Test order flow
- Customize styling
- Add product images
- Implement payment gateway
- Add email notifications
- Deploy to production

## Support

For issues or questions, check the main README.md file.
