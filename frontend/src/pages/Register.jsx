import React, { useState } from "react";
import theme from "../theme";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/reducer/userSlice";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
        {
          fullName,
          email,
          password,
          contact,
          role: selectedRole,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        setFullName("");
        setEmail("");
        setContact("");
        setPassword("");
        setConfirmPassword("");
        setSelectedRole("User");
        navigate("/login");
      }
      setLoading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Internal server error");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!contact) {
      toast.error(
        "Please enter your contact number before signing up with Google."
      );
      return;
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/google-auth-register`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          contact: contact,
          role: selectedRole,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        setFullName("");
        setEmail("");
        setContact("");
        setPassword("");
        setConfirmPassword("");
        setSelectedRole("User");
        navigate("/login");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Internal server error");
      }
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
              Register for Zwigato's industrial-grade platform and streamline
              your food delivery experience.
            </p>
          </div>

          <form onSubmit={submitHandler} className="mt-2">
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.textColor }}
              >
                Full Name
              </label>
              <input
                required
                type="text"
                className="block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-orange-400"
                style={{ borderColor: theme.borderColor }}
                placeholder="Enter Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.textColor }}
              >
                Email
              </label>
              <input
                type="email"
                required
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
                Contact
              </label>
              <input
                type="text"
                required
                className="block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-orange-400"
                style={{ borderColor: theme.borderColor }}
                placeholder="Enter Your Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
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
                  required
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
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.textColor }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  className="block w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-orange-400"
                  style={{ borderColor: theme.borderColor }}
                  placeholder="Enter Your Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.textColor }}
              >
                Role
              </label>
              <div className="flex gap-3 items-center justify-evenly mt-3">
                {["User", "Restaurent Owner", "Delivery Boy"].map((role) => (
                  <div key={role} className="flex items-center">
                    <button
                      type="button"
                      className="flex-1 cursor-pointer border rounded-lg px-3 py-2 text-center font-medium transition-colors duration-300 hover:bg-orange-400 hover:text-white"
                      onClick={() => setSelectedRole(role)}
                      style={{
                        backgroundColor:
                          selectedRole === role
                            ? theme.primaryColor
                            : "transparent",
                        color: selectedRole === role ? "white" : "black",
                      }}
                    >
                      {role}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md text-white font-bold text-base mt-4 hover:bg-orange-700 transition-colors duration-300 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Register"
              )}
            </button>
          </form>
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="w-full py-2 rounded-md text-base mt-4 border flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
            style={{ borderColor: theme.borderColor }}
          >
            <FcGoogle size={20} />
            Sign Up with Google
          </button>
          <div
            className="text-center mt-4"
            style={{ color: theme.secondaryColor }}
          >
            Already have an account?
            <Link to="/login" className=" text-blue-500">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
