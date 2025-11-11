import React, { useState } from "react";
import theme from "../theme";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Login successful! Redirecting...");
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div
          className="max-w-md w-full bg-white rounded-lg shadow-lg p-8"
          style={{ backgroundColor: theme.cardColor, boxShadow: theme.shadow }}
        >
          <div className="text-center">
            <h1
              className="text-3xl font-bold mb-5"
              style={{ color: theme.primaryColor }}
            >
              Zwigato
            </h1>
            <p className="text-sm" style={{ color: theme.textColor }}>
              Login to Zwigato's industrial-grade platform and streamline your
              food delivery experience.
            </p>
          </div>

          <form onSubmit={submitHandler} className="mt-2">
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.textColor }}
              >
                Email
              </label>
              <input
                type="email"
                className="block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-orange-400"
                style={{ borderColor: theme.borderColor }}
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.textColor }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-orange-400"
                  style={{ borderColor: theme.borderColor }}
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              <div
                className="text-right text-sm cursor-pointer"
                style={{ color: theme.primaryColor }}
              >
                {" "}
                <Link to="/forgot-password">Forgot Password</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md text-white font-bold text-base mt-4 hover:bg-orange-700 transition-colors duration-300 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {loading ? (
                <div className="w-6 h-6 animate-spin border-b-2 border-t-2 rounded-full "></div>
              ) : (
                "login"
              )}
            </button>
          </form>
          <button
            type="button"
            className="w-full py-2 rounded-md text-base mt-4 border flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
            style={{ borderColor: theme.borderColor }}
          >
            <FcGoogle size={20} />
            Sign In with Google
          </button>
          <div
            className="text-center mt-4"
            style={{ color: theme.secondaryColor }}
          >
            Want to Create an Account?
            <Link to="/register" className=" text-blue-500">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
