import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

function SignUp() {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success("Sign Up successful ! Welcome to Zwigato");
      setErr("");
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Sign Up failed");
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) {
      toast.error("Mobile number is required");
      return;
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      toast.success("Google Sign Up successful! Welcome to Zwigato");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google Sign Up failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border"
        style={{ borderColor: borderColor }}
      >
        <div className="text-center mb-6">
          <h1
            className="text-4xl font-bold tracking-wide"
            style={{ color: primaryColor }}
          >
            Zwigato
          </h1>
          <p className="text-gray-600 mt-3">
            Create your account to get started with delicious food deliveries
          </p>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="text-gray-700 font-medium mb-1 block">
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor }}
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-700 font-medium mb-1 block">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor }}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="text-gray-700 font-medium mb-1 block">
            Mobile Number
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor }}
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-gray-700 font-medium mb-1 block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 pr-10"
              style={{ borderColor }}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[13px] cursor-pointer text-gray-500"
            >
              {!showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="text-gray-700 font-medium mb-1 block">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 pr-10"
              style={{ borderColor }}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[13px] cursor-pointer text-gray-500"
            >
              {!showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <label className="text-gray-700 font-medium mb-1 block">Role</label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 capitalize cursor-pointer border rounded-lg px-3 py-2 transition font-medium"
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : { borderColor: primaryColor, color: primaryColor }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-[#ff4d2d] cursor-pointer text-white font-semibold py-2 rounded-lg hover:bg-[#e64323] transition"
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
        </button>

        {err && <p className="text-red-500 text-center mt-3">*{err}</p>}

        <button
          className="w-full mt-4 flex items-center justify-center cursor-pointer gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 transition"
          style={{ borderColor: "gray" }}
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={22} />
          <span>Sign up with Google</span>
        </button>

        {/* Navigation */}
        <p
          className="text-center mt-6 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-[#ff4d2d]">Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
