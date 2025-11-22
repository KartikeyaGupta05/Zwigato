import React, { useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { FcSearch } from "react-icons/fc";
import { FaShoppingCart } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import theme from "../theme";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/reducer/userSlice";
import { toast } from "react-toastify";

const UserNavbar = () => {
  const { userData, userCity, cartItems } = useSelector((state) => state.user);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const dispatch = useDispatch();

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
      {showSearchBar && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 flex fixed top-24 left-[5%] px-5 md:hidden">
          <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">{userCity}</div>
          </div>

          <div
            className="flex gap-3.5 items-center text-gray-700 text-[16px] w-[80%]"
            style={{ color: theme.textColor }}
          >
            <FcSearch size={20} className="inline-block mr-2 text-gray-600" />
            <input
              className="outline-0 w-full "
              type="text"
              placeholder="Search Delicious food here..."
            />
          </div>
        </div>
      )}

      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: theme.primaryColor }}
      >
        <Link to="/">Zwigato</Link>
      </h1>

      <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 hidden md:flex px-5 ">
        <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
          <FaLocationDot size={25} className="text-[#ff4d2d]" />
          <div className="w-[80%] truncate text-gray-600">{userCity}</div>
        </div>

        <div
          className="flex gap-3.5 items-center text-gray-700 text-[16px] w-[80%]"
          style={{ color: theme.textColor }}
        >
          <FcSearch size={20} className="inline-block mr-2 text-gray-600" />
          <input
            className="outline-0 w-full "
            type="text"
            placeholder="Search Delicious food here..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {!showSearchBar ? (
          <FcSearch
            onClick={() => setShowSearchBar(true)}
            size={20}
            className="inline-block mr-2 text-gray-600 md:hidden"
          />
        ) : (
          <ImCross
            onClick={() => setShowSearchBar(false)}
            size={20}
            className="inline-block mr-2 text-gray-600 md:hidden cursor-pointer"
          />
        )}

        <>
          <Link to="/cart" className="relative cursor-pointer">
            <FaShoppingCart size={25} className="text-[#ff4d2d]" />
            <span
              className="absolute -top-3.5 -right-4.5 font-semibold text-sm text-white rounded-full px-1.5 py-px"
              style={{
                backgroundColor: theme.primaryColor,
              }}
            >
              {cartItems.length}
            </span>
          </Link>

          <button
            type="button"
            className="hidden md:block px-3 py-1 rounded-lg text-sm font-medium cursor-pointer "
            style={{
              color: theme.secondaryColor,
              border: `2px solid ${theme.primaryColor}`,
              backgroundColor: theme.primaryColor + "20",
            }}
          >
            My Orders
          </button>
        </>
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
            className="md:hidden cursor-pointer font-semibold"
            style={{ color: theme.primaryColor }}
          >
            My Orders
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

export default UserNavbar;
