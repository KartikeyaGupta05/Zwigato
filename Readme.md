# 🍽️ **Zwigato – Full Stack Food Delivery Platform (MERN + Realtime Tracking)**

**Zwigato** is a full-featured food delivery platform built with **MERN Stack**, inspired by Swiggy/Zomato, with real-time delivery tracking, shop management, order assignment, OTP-based verification, and a complete multi-role system (**User, Shop Owner, Delivery Partner**).

This project demonstrates backend engineering, scalable architecture, frontend UI/UX, and real-time systems using **Socket.io**.

---

# 🚀 **Tech Stack**

### **Frontend**

- React + Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Firebase (optional)
- Leaflet Maps (Live delivery tracking)
- Socket.io-client

### **Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer
- Cloudinary
- Nodemailer (OTP emails)
- Razorpay
- Socket.io

---

# 🔐 **System Roles & Capabilities**

### 👤 **User (Customer)**

- Browse restaurants
- Search dishes by category/name
- Add to cart
- Online checkout
- Track order in real-time
- OTP confirmation on delivery
- View previous orders

### 🧑‍🍳 **Shop Owner**

- Create/Edit restaurant
- Add/Edit/Delete food items
- Manage shop menu
- Receive live orders from customers
- Update order status

### 🛵 **Delivery Partner**

- Receive nearby assignments
- Live location updates sent to backend
- Route to customer
- OTP verification to complete delivery
- Daily delivery analytics

---

# 📦 **Features Overview**

### 🎯 **Core Features**

- Complete MERN architecture
- Role-based authentication
- JWT-secured routes
- Image upload using Cloudinary
- Map-based delivery tracking
- Real-time order updates
- Owner dashboard, Delivery dashboard
- Responsive UI

### 📡 **Real-time Functionality**

- Delivery assignment notifications
- Order status updates
- Delivery Boy live location
- Customer tracking UI

---

# 📁 **Project Structure**

```
Zwigato/
├── backend/          # Node + Express + MongoDB
└── frontend/         # React + Vite + Tailwind + Redux
```

---

# 🛠️ **Backend Setup**

### 📌 Navigate to backend

```
cd backend
```

### 📌 Install dependencies

```
npm install
```

### 📌 Environment Variables (`backend/.env`)

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

### 📌 Start server

```
npm run dev
```

---

# 🎨 **Frontend Setup**

### 📌 Navigate to frontend

```
cd frontend
```

### 📌 Install dependencies

```
npm install
```

### 📌 Environment Variables (`frontend/.env`)

```
VITE_SERVER_URL=http://localhost:8000
```

### 📌 Start frontend

```
npm run dev
```

---

# 🗺️ **High-Level Architecture**

```
User App  →  Express API  →  MongoDB
         ↘︎ Socket.io  ↗︎
Delivery Partner App ←→ Real-time Tracking
         ↘︎ Cloudinary, Nodemailer, Razorpay
Shop Owner App ←→ Order Management
```

---

# 🔄 **Order Life Cycle (Realtime)**

1. User places an order
2. Backend creates order + assigns delivery partner
3. Delivery partner gets **live assignment** (socket)
4. Delivery partner sends **live location**
5. User sees real-time map tracking
6. Delivery partner reaches customer
7. OTP verification
8. Order marked delivered

---

# 🖥️ **Screens & Modules**

### 1. User Screens

- Home
- Shop page
- Cart page
- Checkout
- Track Order
- My Orders

### 2. Owner Screens

- Dashboard
- Create/Edit Shop
- Add/Edit Item

### 3. Delivery Boy Screens

- Dashboard
- Assignment list
- Live map view
- OTP Verification

---

# ⚙️ **API Categories**

### 🔐 Auth

- Signup / Login
- Forgot password with OTP
- JWT-based session

### 🍔 Items

- Add/Edit/Delete
- Search & filter

### 🧑‍🍳 Shops

- Create/Edit
- Get shops by city

### 🛒 Orders

- Place order
- Assign delivery
- Update status
- Real-time tracking

### 🚴 Delivery Partner

- Accept assignment
- Live location (Socket.io)
- OTP verification

---

### ✅ **Key Highlights**

- Fully modular MERN architecture
- Real-time delivery tracking (Socket.io)
- Secure authentication & authorization (JWT)
- Scalable folder structure
- Integrated media upload with Cloudinary
- Reusable UI components with Tailwind CSS
- Redux Toolkit for global state management
- Delivery assignment & live updates
- OTP-based delivery verification
- Payment-ready flow (Razorpay integration)

---

# 🤝 **Author**

**Kartikeya Gupta**

<a href="https://linkedin.com/in/kartikeyagupta05" target="_blank"> <img src="https://skillicons.dev/icons?i=linkedin" width="40"/> </a>
<a href="mailto:kartikeyagupta05@gmail.com"> <img src="https://skillicons.dev/icons?i=gmail" width="40"/> </a>
