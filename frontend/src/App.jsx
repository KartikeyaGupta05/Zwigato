import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import CreatedShop from "./pages/CreatedShop.jsx";
import EditShop from "./pages/EditShop.jsx";
import AddItem from "./pages/AddItem.jsx";
import EditItem from "./pages/EditItem.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckOut from "./pages/CheckOut.jsx";
import OrderPlaced from "./pages/OrderPlaced.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import useGetCurrentUser from "./hooks/useGetCurrentUser.jsx";
import useGetUserCity from "./hooks/useGetUserCity.jsx";
import useGetMyShop from "./hooks/useGetMyShop.jsx";
import useGetShopsByCity from "./hooks/useGetShopsByCity.jsx";
import useGetItemsByCity from "./hooks/useGetItemsByCity.jsx";
import useGetMyOrders from "./hooks/useGetMyOrders.jsx";
import useUpdateLocation from "./hooks/useUpdateLocation.jsx";

const PublicRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);
  return !userData ? children : <Navigate to="/" />;
};

const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);
  return userData ? children : <Navigate to="/login" />;
};

function App() {
  useGetCurrentUser();
  useGetUserCity();
  useGetMyShop();
  useGetShopsByCity();
  useGetItemsByCity();
  useGetMyOrders();
  useUpdateLocation();
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/create-shop"
          element={
            <ProtectedRoute>
              <CreatedShop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-shop/:shopId"
          element={
            <ProtectedRoute>
              <EditShop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-item/:itemId"
          element={
            <ProtectedRoute>
              <EditItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/order-placed"
          element={
            <ProtectedRoute>
              <OrderPlaced />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-order/:orderId"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
