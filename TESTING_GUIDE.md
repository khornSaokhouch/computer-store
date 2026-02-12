# Testing Guide

## Quick Setup for Testing

### 1. Seed the Database
```bash
npm run seed
```

This will create:
- **Admin account**: admin@techstore.com / password123
- **Owner account**: owner@techstore.com / password123
- **User account**: user@techstore.com / password123
- **8 sample products** across all categories

### 2. Start the Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## Test Scenarios

### Scenario 1: User Journey (Complete Purchase Flow)

1. **Register New User**
   - Go to http://localhost:3000/register
   - Fill in: Name, Email, Password
   - Click "Register"
   - Should redirect to login

2. **Login**
   - Email: user@techstore.com
   - Password: password123
   - Should redirect to home page

3. **Browse Products**
   - Click "Products" in navbar
   - Should see 8 products
   - Try filters:
     - Category: Laptops
     - Search: "Dell"
     - Price range: 100-1000

4. **View Product Details**
   - Click on "Dell XPS 15"
   - Should see full product details
   - Check specifications
   - See reviews section

5. **Add to Cart**
   - Set quantity to 2
   - Click "Add to Cart"
   - Check cart badge (should show 2)

6. **View Cart**
   - Click "Cart" in navbar
   - Should see Dell XPS 15 x 2
   - Try updating quantity
   - Check total calculation

7. **Checkout**
   - Click "Proceed to Checkout"
   - Fill delivery information:
     - Full Name: John Doe
     - Phone: 012345678
     - Address: 123 Street
     - City: Phnom Penh
   - Select payment: COD
   - Click "Place Order"

8. **View Order**
   - Should redirect to order detail
   - Check invoice number
   - Check order status: Pending

9. **View Order History**
   - Click "Orders" in navbar
   - Should see your order
   - Click to view details

10. **Write Review**
    - Go back to product page
    - Write a review
    - Rate 5 stars
    - Submit review
    - Should see your review

**Expected Result**: ✅ Complete purchase flow works

---

### Scenario 2: Owner Journey (Product Management)

1. **Login as Owner**
   - Email: owner@techstore.com
   - Password: password123
   - Should redirect to Owner Dashboard

2. **View Dashboard**
   - Check statistics:
     - My Products: 8
     - Total Stock: 168
     - Total Sales: $0 (no paid orders yet)
   - See product list

3. **Add New Product**
   - Click "Add New Product"
   - Fill in:
     - Name: ASUS ROG Laptop
     - Brand: ASUS
     - Category: Laptops
     - Price: 1899
     - Stock: 10
     - Description: Gaming laptop with RTX 4060
     - Warranty: 2 Years
     - Images: https://via.placeholder.com/400
   - Click "Create Product"
   - Should redirect to dashboard
   - Should see 9 products now

4. **View Product on Site**
   - Click "Products" in navbar
   - Should see your new product
   - Click to view details

5. **Reply to Review**
   - Go to a product with reviews
   - As owner, you should see reply option
   - (Note: This requires API testing or manual DB update)

**Expected Result**: ✅ Owner can manage products

---

### Scenario 3: Admin Journey (System Management)

1. **Login as Admin**
   - Email: admin@techstore.com
   - Password: password123
   - Should redirect to Admin Dashboard

2. **View Dashboard Statistics**
   - Total Users: 3
   - Total Owners: 1
   - Total Products: 9
   - Total Orders: 1 (from user test)
   - Total Revenue: $0 (COD not paid yet)
   - Recent Orders list

3. **Manage Users**
   - Click "Manage Users"
   - Should see all 3 users
   - Try changing a user's role:
     - Select "owner" for user@techstore.com
     - Should update successfully
   - Change back to "user"

4. **View All Products**
   - Click "Manage Products"
   - Should see all products from all owners

5. **View All Orders**
   - Click "Manage Orders"
   - Should see all orders
   - Try updating order status:
     - Change to "Processing"
     - Change to "Shipped"
     - Change to "Delivered"

**Expected Result**: ✅ Admin has full system control

---

## API Testing with Postman/Thunder Client

### 1. Register User
```http
POST http://localhost:3000/api/auth
Content-Type: application/json

{
  "type": "register",
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected**: 201 Created, success message

### 2. Login
```http
POST http://localhost:3000/api/auth
Content-Type: application/json

{
  "type": "login",
  "email": "owner@techstore.com",
  "password": "password123"
}
```

**Expected**: 200 OK, returns token and user info
**Copy the token for next requests**

### 3. Get All Products
```http
GET http://localhost:3000/api/products
```

**Expected**: 200 OK, array of products

### 4. Get Products by Category
```http
GET http://localhost:3000/api/products?category=Laptops
```

**Expected**: 200 OK, filtered products

### 5. Create Product (Owner/Admin)
```http
POST http://localhost:3000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Test Product",
  "brand": "Test Brand",
  "category": "Laptops",
  "price": 999,
  "stock": 5,
  "description": "Test description",
  "warranty": "1 Year",
  "images": ["https://via.placeholder.com/400"]
}
```

**Expected**: 201 Created, product object

### 6. Create Order (User)
```http
POST http://localhost:3000/api/orders
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "items": [
    {
      "product": "PRODUCT_ID_HERE",
      "name": "Dell XPS 15",
      "price": 1299,
      "quantity": 1,
      "image": "https://via.placeholder.com/400"
    }
  ],
  "totalAmount": 1299,
  "deliveryInfo": {
    "fullName": "John Doe",
    "phone": "012345678",
    "address": "123 Street",
    "city": "Phnom Penh"
  },
  "paymentMethod": "COD"
}
```

**Expected**: 201 Created, order with invoice

### 7. Get Admin Stats
```http
GET http://localhost:3000/api/admin/stats
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Expected**: 200 OK, system statistics

---

## Edge Cases to Test

### Authentication
- [ ] Login with wrong password → Should fail
- [ ] Register with existing email → Should fail
- [ ] Access protected route without token → Should fail
- [ ] Access admin route as user → Should fail

### Products
- [ ] Create product without required fields → Should fail
- [ ] Create product with negative price → Should fail
- [ ] Update product as non-owner → Should fail
- [ ] Delete product as non-owner → Should fail

### Orders
- [ ] Create order without items → Should fail
- [ ] Create order without delivery info → Should fail
- [ ] View other user's order → Should fail

### Cart
- [ ] Add product with quantity > stock → Should validate
- [ ] Add product with 0 stock → Should prevent
- [ ] Update cart quantity to 0 → Should remove item

### Reviews
- [ ] Submit review without login → Should redirect
- [ ] Submit duplicate review → Should fail
- [ ] Submit review with invalid rating → Should fail

---

## Performance Testing

### Load Testing
1. Create 100 products
2. Test search performance
3. Test filter performance
4. Check database query time

### Stress Testing
1. Multiple concurrent users
2. Multiple cart operations
3. Multiple order placements

---

## Browser Testing

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

## Responsive Design Testing

Test on:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Security Testing

- [ ] SQL Injection attempts
- [ ] XSS attempts
- [ ] CSRF protection
- [ ] JWT token expiration
- [ ] Password strength
- [ ] Rate limiting (if implemented)

---

## Bug Reporting Template

```
**Title**: Brief description

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen

**Actual Result**: What actually happened

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Screen: 1920x1080

**Screenshots**: (if applicable)
```

---

## Test Checklist

### User Features
- [ ] Registration works
- [ ] Login works
- [ ] Browse products
- [ ] Search products
- [ ] Filter products
- [ ] View product details
- [ ] Add to cart
- [ ] Update cart
- [ ] Remove from cart
- [ ] Checkout
- [ ] Place order
- [ ] View orders
- [ ] Write review

### Owner Features
- [ ] Owner dashboard loads
- [ ] View statistics
- [ ] Create product
- [ ] Update product
- [ ] Delete product
- [ ] View orders
- [ ] Reply to reviews

### Admin Features
- [ ] Admin dashboard loads
- [ ] View system stats
- [ ] Manage users
- [ ] Change user roles
- [ ] Delete users
- [ ] View all products
- [ ] View all orders
- [ ] Update order status
- [ ] Delete reviews

### UI/UX
- [ ] Navbar displays correctly
- [ ] Footer displays correctly
- [ ] Forms validate input
- [ ] Error messages show
- [ ] Success messages show
- [ ] Loading states work
- [ ] Responsive on mobile
- [ ] Images load properly

---

## Automated Testing (Future)

Consider adding:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests
- Supertest for API tests

---

## Test Results Template

```
Date: YYYY-MM-DD
Tester: Your Name
Environment: Development

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ Pass | Works as expected |
| User Login | ✅ Pass | - |
| Product Browse | ✅ Pass | - |
| Add to Cart | ❌ Fail | Cart count not updating |
| Checkout | ⚠️ Partial | Payment validation needed |

Overall Status: 80% Pass Rate
```

---

## Support

If you find bugs or issues:
1. Check this testing guide
2. Review error logs
3. Check browser console
4. Review API responses
5. Document and report
