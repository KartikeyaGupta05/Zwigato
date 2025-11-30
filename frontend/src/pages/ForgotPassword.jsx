import axios from "axios";
import React, { useState, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const getOtpString = () => otp.join("");

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      toast.success("OTP sent successfully");
      setErr("");
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp: getOtpString() },
        { withCredentials: true }
      );
      setErr("");
      setStep(3);
      toast.success("OTP verified successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return setErr("Passwords do not match");
    }

    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      setErr("");
      navigate("/signin");
      toast.success("Password reset successful! You can now sign in.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    }
    setLoading(false);
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) otpRefs[index + 1].current.focus();
    if (!value && index > 0) otpRefs[index - 1].current.focus();
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <IoIosArrowRoundBack
            size={32}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-3xl font-bold text-[#ff4d2d] tracking-wide">
            Forgot Password
          </h1>
        </div>

        {step === 1 && (
          <div>
            <div className="mb-6">
              <label className="text-gray-700 font-medium mb-1 block">
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/30 outline-none transition"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <button
              className="w-full font-semibold cursor-pointer py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323] transition"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>

            {err && <p className="text-red-500 text-center mt-3">*{err}</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="text-gray-700 font-medium mb-3 block">
              Enter OTP
            </label>

            {/* 4 OTP Inputs */}
            <div className="flex justify-between gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-semibold border rounded-lg border-gray-300 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/30 outline-none transition"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                />
              ))}
            </div>

            <button
              className="w-full font-semibold cursor-pointer py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323] transition"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
            </button>

            {err && <p className="text-red-500 text-center mt-3">*{err}</p>}
          </div>
        )}

        {/* STEP 3 – Reset Password */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <label className="text-gray-700 font-medium mb-1 block">
                New Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/30 outline-none transition"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div className="mb-6">
              <label className="text-gray-700 font-medium mb-1 block">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/30 outline-none transition"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>

            <button
              className="w-full font-semibold cursor-pointer py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323] transition"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>

            {err && <p className="text-red-500 text-center mt-3">*{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
