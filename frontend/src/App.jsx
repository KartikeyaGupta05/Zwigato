import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGetCurrentUser from "./hooks/useGetCurrentUser.jsx";
import { useSelector } from "react-redux";

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
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
