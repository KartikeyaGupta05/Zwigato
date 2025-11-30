# 📦 **Zwigato Backend – REST API (Node.js + Express + MongoDB)**

This is the backend for **Zwigato**, a full-stack food-delivery platform that provides authentication, shop management, food items CRUD, real-time delivery assignments, order processing, OTP-based delivery verification, and live delivery-boy location tracking.

---

## 🚀 **Tech Stack**

| Technology               | Purpose                                    |
| ------------------------ | ------------------------------------------ |
| **Node.js + Express.js** | Backend framework for REST API             |
| **MongoDB + Mongoose**   | Database & ODM                             |
| **JWT Authentication**   | Secure login & protected routes            |
| **Socket.io**            | Real-time order assignment & live location |
| **Multer**               | Image upload handling                      |
| **Cloudinary**           | Image storage (items & shops)              |
| **Nodemailer**           | OTP email delivery                         |
| **Razorpay**             | Payment integration                        |

---

## 🔐 **Environment Variables**

Create a `.env` file inside the backend folder:

```
PORT=8000
MONGODB_URL=
JWT_SECRET=
EMAIL=
PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## 🏗️ **Simplified Project Structure**

```
backend
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controllers.js
│   ├── item.controllers.js
│   ├── order.controllers.js
│   ├── shop.controllers.js
│   └── user.controllers.js
├── middlewares/
│   ├── isAuth.js
│   └── multer.js
├── models/
│   ├── user.model.js
│   ├── shop.model.js
│   ├── item.model.js
│   ├── order.model.js
│   └── deliveryAssignment.model.js
├── routes/
│   ├── auth.routes.js
│   ├── item.routes.js
│   ├── shop.routes.js
│   ├── user.routes.js
│   └── order.routes.js
├── utils/
│   ├── token.js
│   ├── cloudinary.js
│   └── mail.js
└── index.js
```

---

## 🔥 **Core Backend Features**

### ⭐ **User Authentication**

* User Signup & Login
* JWT-based secure authentication
* Forgot Password with email OTP
* Update profile & location

### ⭐ **Shop Management (Owner Module)**

* Create/Edit Food Shop
* Upload shop image to Cloudinary
* Fetch shops by city
* Owner dashboard data

### ⭐ **Food Item Management**

* Add/Edit/Delete food items
* Upload food image to Cloudinary
* Get items by shop or city
* Search items

### ⭐ **Order Management**

* Place new orders
* Assign order to shop
* Track order status
* Payment integration with Razorpay
* Real-time order status updates via Socket.io

### ⭐ **Delivery Partner Module**

* Live location updates via Socket.io
* Receive assignment notifications
* Accept/reject delivery requests
* OTP verification for completed delivery
* Daily earnings and analytics

---

## 📡 **API Overview**

### 🔑 **Auth Routes**

```
POST /api/auth/signup
POST /api/auth/signin
GET  /api/auth/signout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### 🏪 **Shop Routes**

```
POST /api/shop/create-edit
GET  /api/shop/get-by-city/:city
GET  /api/shop/get-my
```

### 🍔 **Item Routes**

```
POST   /api/item/add-item
POST   /api/item/edit-item/:itemId
GET    /api/item/delete/:itemId
GET    /api/item/search-items
GET    /api/item/get-by-id/:itemId
GET    /api/item/get-by-shop/:shopId
GET    /api/item/get-by-city/:city
```

### 📦 **Order Routes**

```
POST /api/order/place-order
POST /api/order/verify-payment
GET  /api/order/my-orders
GET  /api/order/get-assignments
GET  /api/order/get-current-order
POST /api/order/send-delivery-otp
POST /api/order/verify-delivery-otp
POST /api/order/update-status/:orderId/:shopId
GET  /api/order/accept-order/:assignmentId
GET  /api/order/get-order-by-id/:orderId
GET  /api/order/get-today-deliveries
```

### 🚚 **User Routes**

```
GET /api/user/current
POST /api/user/update-location
```


---

## ⚙️ **Installation & Setup**

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Start development server

```
npm run dev
```

### 3️⃣ API will run on:

```
http://localhost:8000
```

---

## 🧩 **Real-Time Features (Socket.io)**

The backend supports real-time communication:

* New order assignment to delivery partner
* Live location updates
* Real-time order status updates for customers
* Owner gets new order notifications

---

## 🖼️ **Image Uploading (Cloudinary)**

All shop and food images are uploaded using:

* Multer for temporary storage
* Cloudinary API for permanent hosting
* Automatic response with image URL

---

## ✔️ **Production-Ready & Secure**

This backend includes:

* Secure JWT token management
* Password hashing
* Rate-limited OTP requests
* Input validation
* Protected routes (middleware)

---

## 👨‍💻 **Author**

Zwigato MERN Stack Full-Stack Project
Backend Lead: **Kartikeya Gupta**
