# 🛒 Smart-Ecommerce

### 🚀 A Complete Role-Based E-Commerce Platform

**Smart-Ecommerce** is a modern full-stack e-commerce platform designed to connect **Customers, Sellers, and Administrators** in one complete ecosystem.

From **product discovery → cart → Razorpay payment → order tracking → seller management → admin control**, everything is managed through a secure and scalable architecture.

### 🌐 Live Demo

🔗 **[Visit Smart-Ecommerce](https://smart-ecommerce-alpha.vercel.app/)**

🔗 **[Backend API](https://smart-ecommerce-site.onrender.com/)**

---

## 💡 What Makes Smart-Ecommerce Different?

Unlike a basic shopping website, Smart-Ecommerce is built around a **multi-role marketplace architecture**.

```text
                 🛒 SMART-ECOMMERCE
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       👤 USER        🏪 SELLER      👨‍💼 ADMIN
          │              │              │
       Shopping       Products       Platform
       Cart           Inventory      Control
       Payment        Orders         Analytics
       Orders         Sales          Approvals
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                  🔐 Secure APIs
                         ↓
                  🗄️ MongoDB Atlas
```

---

# ✨ Features

## 👤 Customer Experience

🛍️ **Smart Shopping**

* Browse products
* Search products
* Filter products
* View product details
* Add/remove products from cart
* Update quantities

💳 **Secure Checkout**

* Checkout system
* Razorpay integration
* Payment verification
* Automatic order creation

📦 **Order Management**

* View previous orders
* Track order status
* View order details
* Return/order management

⭐ **Product Reviews**

* Review purchased products
* Product feedback system

---

# 🏪 Seller Dashboard

Sellers get their own dedicated marketplace workspace.

### 📦 Product Management

* Add products
* Edit products
* Manage inventory
* Track product approval status

### 🚚 Order Management

* View incoming orders
* Accept/reject orders
* Update order status
* Manage seller-side orders

### 📊 Seller Insights

* Dashboard statistics
* Sales information
* Product information

---

# 👨‍💼 Admin Control Center

A complete administrative panel for managing the platform.

### 👥 User Management

* View users
* Manage users
* Block/unblock users

### 🛍️ Product Management

* View products
* Review seller products
* Approve products
* Reject products

### 📦 Order Management

* View platform orders
* Manage order information
* Monitor order status

### 🏷️ Platform Management

* Categories
* Coupons
* Returns
* Notifications

### 📈 Analytics & Reports

* Sales analytics
* Platform reports
* Dashboard statistics

### 🔐 Permission-Based Admin Access

Admin functionality is controlled using **role + permission-based authorization**.

---

# 🔐 Authentication & Security

Security is a core part of Smart-Ecommerce.

### Authentication

```text
User Login
    ↓
JWT Token
    ↓
Protected API
    ↓
Role Verification
    ↓
Authorized Resource
```

### Security Features

* 🔑 JWT Authentication
* 🔒 Password hashing with bcrypt
* 🛡️ Protected API routes
* 👥 Role-based authorization
* 🔐 Permission-based authorization
* 🚫 Protected Admin/Seller operations
* 🌱 Environment variables for secrets

---

# 💳 Razorpay Payment System

Smart-Ecommerce includes an integrated Razorpay payment workflow.

```text
🛒 Cart
   ↓
💰 Checkout
   ↓
🏦 Razorpay Order
   ↓
💳 Payment
   ↓
🔐 Signature Verification
   ↓
📦 Order Created
   ↓
🏪 Seller Receives Order
```

The payment signature is verified on the backend before the order is created.

---

# 🔄 Product Approval Workflow

Seller products don't immediately become visible to customers.

```text
🏪 Seller
    │
    ↓
➕ Add Product
    │
    ↓
⏳ Pending
    │
    ↓
👨‍💼 Admin Review
    │
   ┌┴──────────┐
   ↓           ↓
✅ Approved   ❌ Rejected
   │
   ↓
🛍️ Available to Customers
```

This creates a controlled marketplace environment.

---

# 📦 Order Lifecycle

```text
👤 Customer
     ↓
🛒 Cart
     ↓
💳 Payment
     ↓
📦 Order Created
     ↓
🏪 Seller Receives Order
     ↓
⏳ Processing
     ↓
🚚 Shipped
     ↓
✅ Delivered
```

---

# 🧠 Tech Stack

| Layer                | Technology   |
| -------------------- | ------------ |
| 🎨 Frontend          | React.js     |
| ⚡ Build Tool         | Vite         |
| 💻 Language          | JavaScript   |
| 🌐 Backend           | Node.js      |
| 🚀 Framework         | Express.js   |
| 🗄️ Database         | MongoDB      |
| 🔗 ODM               | Mongoose     |
| 🔐 Authentication    | JWT          |
| 🔒 Password Security | bcryptjs     |
| 💳 Payment           | Razorpay     |
| 🔄 Real-time         | Socket.io    |
| 📡 API Client        | Axios        |
| 🧪 API Testing       | Postman      |
| 📦 Version Control   | Git + GitHub |
| ☁️ Frontend Hosting  | Vercel       |
| ☁️ Backend Hosting   | Render       |

---

# 🏗️ Project Architecture

```text
Smart-Ecommerce/
│
├── 🎨 frontend/
│   ├── components/
│   ├── pages/
│   │   ├── user/
│   │   ├── seller/
│   │   └── admin/
│   ├── layouts/
│   ├── services/
│   └── styles/
│
├── ⚙️ backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── 🔐 .gitignore
└── 📖 README.md
```

---

# 🌐 Production Architecture

Smart-Ecommerce is deployed as a full-stack application:

```text
                     🌍 USER
                        │
                        ↓
              ☁️ VERCEL FRONTEND
                        │
                        ↓
             🚀 RENDER BACKEND API
                        │
              ┌─────────┴─────────┐
              ↓                   ↓
       🗄️ MONGODB ATLAS       💳 RAZORPAY
```

### Live Application

**Frontend:**
https://smart-ecommerce-rose.vercel.app/

**Backend:**
https://smart-ecommerce-at33.onrender.com/

---

# ⚙️ Run Locally

### Clone the project

```bash
git clone https://github.com/tannu01-dev/Smart-Ecommerce.git

cd Smart-Ecommerce
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> ⚠️ Never commit your `.env` file or secret credentials to GitHub.

---

# 📊 Project Highlights

### 🔥 Full-Stack Architecture

Complete frontend + backend + database integration.

### 🔐 Role-Based Access Control

Different capabilities for Users, Sellers, and Admins.

### 💳 Real Payment Integration

Razorpay payment creation and backend signature verification.

### 🏪 Marketplace Workflow

Seller → Admin approval → Customer marketplace.

### 📦 Complete Order Lifecycle

From checkout to seller processing and order status updates.

### ☁️ Production Deployment

Frontend deployed on Vercel and backend deployed on Render.

---

# 🚀 Future Improvements

The platform can be extended with:

🤖 **AI Product Recommendations**

📍 **Location-Based Product Discovery**

💬 **Real-Time Seller ↔ Customer Chat**

🧠 **AI Shopping Assistant**

❤️ **Wishlist**

🔎 **Advanced Product Comparison**

📧 **Email/SMS Order Notifications**

📊 **Advanced Seller Analytics**

🚚 **Delivery Partner Integration**

---

# 👩‍💻 Author

### Tannu Pal

**Full Stack Developer**

Interested in building scalable web applications using:

`React.js` • `Node.js` • `Express.js` • `MongoDB` • `AI`

---

# ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!

### Built with ❤️, JavaScript & lots of debugging 😄

**Smart-Ecommerce — One platform. Three roles. Complete marketplace.**
