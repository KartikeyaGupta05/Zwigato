import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { TfiReceipt } from "react-icons/tfi";
import theme from "../theme";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/reducer/userSlice";
import { toast } from "react-toastify";

const OwnerNavbar = () => {
  const { userData } = useSelector((state) => state.user);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
        { withCredentials: true }
      );
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-[30px] px-5 fixed top-0 z-9999 bg-[#fff9f6] overflow-visible shadow-md">
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: theme.primaryColor }}
      >
        <Link to="/">Zwigato</Link>
      </h1>

      <div className="flex items-center gap-6">
        {myShopData && (
          <>
            <button
              type="button"
              onClick={() => navigate("/add-item")}
              className="px-3 py-1 hidden md:flex items-center gap-2 rounded-lg text-sm font-medium cursor-pointer "
              style={{
                color: theme.secondaryColor,
                border: `2px solid ${theme.primaryColor}`,
                backgroundColor: theme.primaryColor + "20",
              }}
            >
              <FaPlus size={20} className="text-[#ff4d2d]" />
              <span>Add Food Item</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/add-item")}
              className="px-3 py-1 md:hidden flex items-center gap-2 rounded-full text-sm font-medium cursor-pointer "
              style={{
                color: theme.secondaryColor,
                border: `2px solid ${theme.primaryColor}`,
                backgroundColor: theme.primaryColor + "20",
              }}
            >
              <FaPlus size={20} className="text-[#ff4d2d] font-bold" />
            </button>
          </>
        )}
        <div
          className=" relative md:flex hidden items-center gap-3 px-3 py-1 rounded-lg text-sm font-medium cursor-pointer "
          onClick={() => navigate("/my-orders")}
          style={{
            color: theme.secondaryColor,
            border: `2px solid ${theme.primaryColor}`,
            backgroundColor: theme.primaryColor + "20",
          }}
        >
          <TfiReceipt size={20} />
          <span>Orders Received</span>
          <span
            className="absolute -top-2.5 -right-2.5 font-semibold text-sm text-white rounded-full px-1.5 py-px"
            style={{
              backgroundColor: theme.primaryColor,
            }}
          >
            0
          </span>
        </div>

        <div
          className="relative flex md:hidden items-center gap-3 px-3 py-1 rounded-lg text-sm font-medium cursor-pointer "
          onClick={() => navigate("/my-orders")}
          style={{
            color: theme.secondaryColor,
            border: `2px solid ${theme.primaryColor}`,
            backgroundColor: theme.primaryColor + "20",
          }}
        >
          <TfiReceipt size={20} />
          <span
            className="absolute -top-2.5 -right-2.5 font-semibold text-sm text-white rounded-full px-1.5 py-px"
            style={{
              backgroundColor: theme.primaryColor,
            }}
          >
            
          </span>
        </div>

        <div
          className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-lg cursor-pointer"
          onClick={() => setShowInfoBox((prev) => !prev)}
        >
          {userData?.user?.fullName.slice(0, 1).toUpperCase()}
        </div>
      </div>
      {showInfoBox && (
        <div className="fixed top-20 right-2.5 md:right-[10%] lg:right-[15%] w-[180px] bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-2.5 z-9999">
          <div className="text-[16px] font-semibold">
            {userData?.user?.fullName}
          </div>
          <div
            className="cursor-pointer font-semibold"
            style={{ color: theme.primaryColor }}
            onClick={handleLogout}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerNavbar;
