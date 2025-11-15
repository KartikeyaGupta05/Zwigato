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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGetCurrentUser from "./hooks/useGetCurrentUser.jsx";
import { useSelector } from "react-redux";
import useGetUserCity from "./hooks/useGetUserCity.jsx";
import useGetMyShop from "./hooks/useGetMyShop.jsx";
import useGetShopsByCity from "./hooks/useGetShopsByCity.jsx";
import useGetItemsByCity from "./hooks/useGetItemsByCity.jsx";

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
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
