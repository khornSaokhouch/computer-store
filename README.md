# TechStore - Computer Accessories E-Commerce Platform

A full-stack e-commerce platform for computer products and accessories built with Next.js and MongoDB.

## Features

### User Roles
- **User**: Browse products, add to cart, place orders, write reviews
- **Owner**: Manage products, view sales, respond to reviews
- **Admin**: Full system control, manage users, products, and orders

### Core Functionality
- ✅ User authentication with JWT tokens
- ✅ Role-based access control (User, Owner, Admin)
- ✅ Product catalog with search and filters
- ✅ Shopping cart and checkout system
- ✅ Multiple payment methods (COD, ABA Pay, Wing, PayPal, Stripe)
- ✅ Order management and tracking
- ✅ Product reviews and ratings
- ✅ Owner and Admin dashboards
- ✅ Invoice generation

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd computer-store
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
computer-store/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── admin/
│   │   └── dashboard/      # Admin dashboard
│   ├── owner/
│   │   ├── dashboard/      # Owner dashboard
│   │   └── products/       # Product management
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   ├── products/       # Product CRUD
│   │   ├── orders/         # Order management
│   │   └── admin/          # Admin endpoints
│   ├── components/
│   │   ├── Navbar.jsx      # Navigation bar
│   │   └── Footer.jsx      # Footer
│   ├── lib/
│   │   ├── mongodb.js      # Database connection
│   │   └── api.js          # API utilities
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── models/
│   │   ├── User.js         # User model
│   │   ├── Product.js      # Product model
│   │   └── Order.js        # Order model
│   ├── products/           # Product pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout page
│   └── orders/             # Order history
├── public/                 # Static assets
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth` - Login/Register

### Products
- `GET /api/products` - Get all products (with filters)
- `POST /api/products` - Create product (Owner/Admin)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (Owner/Admin)
- `DELETE /api/products/[id]` - Delete product (Owner/Admin)

### Reviews
- `POST /api/products/[id]/reviews` - Add review
- `PUT /api/products/[id]/reviews` - Reply to review (Owner/Admin)
- `DELETE /api/products/[id]/reviews` - Delete review (Admin)

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order status (Owner/Admin)

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users` - Update user role
- `DELETE /api/admin/users` - Delete user

### Owner
- `GET /api/owner/stats` - Get owner statistics

## Default User Roles

After registration, users are assigned the "user" role by default. To create admin or owner accounts:

1. Register a new account
2. Use MongoDB Compass or Atlas to manually change the `role` field to "admin" or "owner"

## Usage

### As a User
1. Register/Login
2. Browse products by category or search
3. Add products to cart
4. Proceed to checkout
5. Enter delivery information
6. Choose payment method
7. Place order
8. Track order status
9. Write product reviews

### As an Owner
1. Login with owner account
2. Access owner dashboard
3. Add new products
4. Manage product inventory
5. View sales statistics
6. Respond to customer reviews

### As an Admin
1. Login with admin account
2. Access admin dashboard
3. View system statistics
4. Manage all users
5. Manage all products
6. Manage all orders
7. Monitor revenue

## Features to Add (Future)

- [ ] AI-based product recommendations
- [ ] Discount and coupon system
- [ ] Live chat support
- [ ] Low-stock alerts
- [ ] Product comparison
- [ ] Email notifications
- [ ] Image upload functionality
- [ ] Advanced analytics

## License

MIT

## Author

Your Name
