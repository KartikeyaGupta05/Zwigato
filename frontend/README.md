# 🎨 **Zwigato Frontend – React + Vite + Tailwind + Redux**

This is the **frontend** of **Zwigato**, a full-stack food-delivery platform that includes browsing restaurants, searching items, placing orders, tracking orders in real-time, delivery boy live tracking, and a complete shop-owner dashboard.

The frontend is built using **React, Vite, Redux Toolkit, Tailwind CSS, Firebase, and Socket.io-client**.

---

## 🚀 **Tech Stack**

| Technology                  | Purpose                                          |
| --------------------------- | ------------------------------------------------ |
| **React + Vite**            | Frontend UI framework                            |
| **Tailwind CSS**            | Fast UI styling                                  |
| **Redux Toolkit**           | State management (auth, cart, orders, shop data) |
| **Socket.io Client**        | Real-time updates                                |
| **Firebase**                | Image upload (if used), hosting (optional)       |
| **Axios**                   | API communication                                |
| **Leaflet + React-Leaflet** | Live map tracking                                |
| **React Icons**             | Icons                                            |
| **React Router DOM**        | Navigation                                       |

---

## 📁 **Simplified Frontend Structure**

```
src
├── assets/               → images & icons
├── components/           → reusable UI components
│   ├── Nav.jsx
│   ├── Footer.jsx
│   ├── FoodCard.jsx
│   ├── DeliveryBoy.jsx
│   ├── UserOrderCard.jsx
│   ├── OwnerOrderCard.jsx
│   ├── DeliveryBoyTracking.jsx
│   └── ...
├── pages/                → main pages
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── CartPage.jsx
│   ├── MyOrders.jsx
│   ├── TrackOrderPage.jsx
│   ├── OwnerDashboard.jsx
│   ├── AddItem.jsx
│   ├── EditItem.jsx
│   ├── CreateEditShop.jsx
│   ├── SignIn.jsx
│   ├── SignUp.jsx
│   └── ForgotPassword.jsx
├── redux/
│   ├── store.js
│   ├── userSlice.js
│   ├── ownerSlice.js
│   └── mapSlice.js
├── hooks/
│   ├── useGetCity.jsx
│   ├── useGetCurrentUser.jsx
│   ├── useGetItemsByCity.jsx
│   ├── useGetMyOrders.jsx
│   └── useUpdateLocation.jsx
├── App.jsx               → Main routes
└── main.jsx             → React entry point
```

---

## 🔥 **Frontend Features**

### 👤 **User Module**

* Browse restaurants by city
* Search foods across all shops
* View shop menu
* Add to cart
* Checkout & place orders
* Track order in real-time
* Delivery OTP verification flow
* Order history

### 🛵 **Delivery Partner**

* Live map with directions
* Real-time location share to backend
* Accept delivery assignments
* OTP submission for delivery
* Daily earnings chart

### 🧑‍🍳 **Shop Owner**

* Create/Edit restaurant
* Add/Edit/Delete food items
* Manage shop menu
* Track customer orders
* Real-time new order notifications

### 🧭 **Navigation & UI**

* Fully responsive NavBar
* Tailwind-based theme
* Category cards, Food cards, Order cards
* Smooth animations

---

## 🔗 **API Configuration**

Update the backend server URL in `App.jsx` file as :

```
serverUrl=http://localhost:8000
```

And inside the project, all API calls use:

```js
import { serverUrl } from "../App";
```

---

## ⚙️ **Installation & Setup**

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Run development server

```
npm run dev
```

### 3️⃣ Frontend will run on:

```
http://localhost:5173
```

---

## 🌐 **Key Functional Workflows**

### 🔄 **User Order Flow**

1. User selects food
2. Adds to cart
3. Checks out
4. Payment (Razorpay)
5. Backend assigns delivery partner
6. Real-time tracking
7. OTP verification on delivery

### 🛵 **Delivery Boy Flow**

1. Receives assignment (Socket.io)
2. Shares location live
3. Maps shows customer position
4. Sends OTP to customer
5. Delivery completion

### 🧑‍🍳 **Shop Owner Flow**

1. Creates shop
2. Uploads shop image
3. Adds food items
4. Receives real-time orders

---

## 🗺️ **Maps & Tracking**

The project uses:

* **Leaflet**
* **OpenStreetMap tiles**
* **Real-time coordinates (Socket.io)**

To show:

* Delivery boy live movement
* Customer location
* Shop to customer routing

---

## 🎨 **UI Theme**

* Primary Color: `#ff4d2d` (Zwigato Orange)
* Background: Light cream `#fff9f6`
* Rounded components
* Shadows for depth
* Mobile-first responsive UI

This creates a premium, modern food-delivery interface.

---

## 🤝 **Author**

Frontend Lead – **Kartikeya Gupta**

