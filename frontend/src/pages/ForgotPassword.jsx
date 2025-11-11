import React, { useState } from "react";
import theme from "../theme";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otps, setOtps] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const submitHandlerSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("OTP sent to your email");
        setStep(2);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitHandlerVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/verify-otp`,
        { email, otp: otps },
        { withCredentials: true }
      );
      setStep(3);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitHandlerResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="bg-white p-3 shadow-lg md:w-[30%] w-full rounded  ">
        <div className="flex items-center gap-28">
          <Link to="/login" className="text-2xl">
            <GoArrowLeft />
          </Link>
          <h1
            className="font-bold text-xl"
            style={{ color: theme.primaryColor }}
          >
            Forgot Password
          </h1>
        </div>
        {step == 1 && (
          <form className="mt-5" onSubmit={submitHandlerSendOtp}>
            <div className="text-center mb-4 font-semibold">
              Enter your email address for password reset
            </div>
            <div className="flex flex-col">
              <label className="text-md capitalize font-semibold tracking-tight leading-none">
                email
              </label>
              <input
                className="border px-1 font-semibold tracking-tight leading-none py-2  rounded-md mt-1 border-zinc-300 "
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="text-md capitalize font-semibold flex items-center justify-center text-white tracking-tight leading-none bg-[rgb(240,107,41)] w-full mt-5 px-1 py-3.5 rounded"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <h1>please wait...</h1>
                  <div className="w-6 h-6 animate-spin border-b-3  rounded-full "></div>
                </div>
              ) : (
                "sent OTP"
              )}
            </button>
          </form>
        )}

        {step == 2 && (
          <form className="mt-5" onSubmit={submitHandlerVerifyOtp}>
            <div className="flex flex-col">
              <label className="text-md capitalize font-semibold tracking-tight leading-none">
                OTP
              </label>
              <input
                className="border px-1 font-semibold tracking-tight leading-none py-2  rounded-md mt-1 border-zinc-300 "
                type="text"
                placeholder="Enter Your OTP"
                value={otps}
                onChange={(e) => setOtps(e.target.value)}
              />
            </div>
            <button
              className="text-md capitalize font-semibold flex items-center justify-center text-white tracking-tight leading-none bg-[rgb(240,107,41)] w-full mt-5 px-1 py-3.5 rounded"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <h1>please wait...</h1>
                  <div className="w-6 h-6 animate-spin border-b-3  rounded-full "></div>
                </div>
              ) : (
                "verify OTP"
              )}
            </button>
          </form>
        )}

        {step == 3 && (
          <form className="mt-5" onSubmit={submitHandlerResetPassword}>
            <div className="flex flex-col">
              <label className="text-md capitalize font-semibold tracking-tight leading-none">
                New password
              </label>
              <input
                className="border px-1 font-semibold tracking-tight leading-none py-2  rounded-md mt-1 border-zinc-300 "
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-5">
              <label className="text-md capitalize font-semibold tracking-tight leading-none">
                Confirm password
              </label>
              <input
                className="border px-1 font-semibold tracking-tight leading-none py-2  rounded-md mt-1 border-zinc-300 "
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              className="text-md capitalize font-semibold flex items-center justify-center text-white tracking-tight leading-none bg-[rgb(240,107,41)] w-full mt-5 px-1 py-3.5 rounded"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <h1>please wait...</h1>
                  <div className="w-6 h-6 animate-spin border-b-3  rounded-full "></div>
                </div>
              ) : (
                "reset password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
