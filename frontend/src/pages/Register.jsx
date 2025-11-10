import React, { useState } from "react";
import theme from "../theme";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("User");

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

          <form className="mt-6">
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.textColor }}
              >
                Full Name
              </label>
              <input
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
                Role
              </label>
              <div className="flex gap-3 items-center justify-evenly mt-3">
                {["User", "Owner", "Delivery Boy"].map((role) => (
                  <div key={role} className="flex items-center">
                    <button type="button" className="flex-1 cursor-pointer border rounded-lg px-5 py-2 text-center font-medium transition-colors duration-300 hover:bg-orange-400 hover:text-white"
                    onClick={() => setSelectedRole(role)}
                      style={{
                        backgroundColor: selectedRole === role ? theme.primaryColor : "transparent",
                        color: selectedRole === role ? "white" : "black",
                      }}>
                      {role}
                      
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-md text-white font-bold text-base mt-4 hover:bg-orange-700 transition-colors duration-300 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor}}
            >
              Register
            </button> 

            <button className="w-full py-2 rounded-md text-base mt-4 border flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-300 cursor-pointer" style={{ borderColor: theme.borderColor }}>
              <FcGoogle size={20} />
              Sign Up with Google
            </button>
            <div className="text-center mt-4" style={{ color: theme.secondaryColor }}>
              Already have an account?
                <Link to="/login" className=" text-blue-500" > Login</Link>
                </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
