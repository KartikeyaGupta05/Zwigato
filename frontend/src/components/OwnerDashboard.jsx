import React from "react";
import OwnerNavbar from "./OwnerNavbar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <OwnerNavbar />
      {!myShopData && (
        <div className="flex justify-center items-center mt-20 p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                Please add your restaurant to start managing your menu and
                orders. Join us in serving delicious food to our customers!
              </p>
              <Link
                to="/create-shop"
                className="mt-4 px-4 py-2 bg-[#ff4d2d] cursor-pointer font-semibold text-white rounded-lg hover:bg-[#e04324] transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full flex flex-col items-center gap-8 px-4 sm:px-6 mt-20">
          <div className="flex flex-col items-center">
            <div
              className="
        w-24 h-24 sm:w-28 sm:h-28
        rounded-full flex items-center justify-center 
        bg-linear-to-br from-orange-100 to-orange-300 
        shadow-xl
      "
            >
              <FaUtensils className="text-[#ff4d2d] w-12 h-12 sm:w-14 sm:h-14" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight text-center">
              Welcome to {myShopData?.shop?.shopName}
            </h1>

            <p className="text-gray-500 text-sm sm:text-base mt-1 text-center max-w-md">
              Manage your shop information, menu, and orders in one place.
            </p>
          </div>

          <div
            className="
  bg-white shadow-xl rounded-2xl overflow-visible 
  border border-orange-100 w-full max-w-3xl relative 
  transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
"
          >
            <div
              className="
      absolute top-4 right-4 
      bg-[#ff4d2d] text-white p-2.5 
      rounded-full shadow-xl cursor-pointer
      hover:bg-orange-600 active:scale-95 
      transition-all duration-300
      z-20
    "
            >
              <FaPen size={20} />
            </div>

            <div className="overflow-hidden rounded-t-2xl relative z-10">
              <img
                src={myShopData?.shop?.image}
                alt={myShopData?.shop?.shopName}
                className="
        w-full h-56 sm:h-72 object-cover 
        transition-transform duration-500 
        hover:scale-105
      "
              />
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {myShopData?.shop?.shopName}
              </h2>

              <div className="flex flex-col gap-1 text-gray-600 text-[15px] sm:text-base">
                <p>
                  📍 {myShopData?.shop?.city}, {myShopData?.shop?.state}
                </p>
                <p className="mb-3">🏠 {myShopData?.shop?.address}</p>
              </div>

              {/* EXTRA INFO BADGES */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span
                  className="
            px-4 py-1.5 rounded-full text-sm font-semibold 
            bg-orange-100 text-orange-700
          "
                >
                  ✔ Verified Shop
                </span>

                <span
                  className="
            px-4 py-1.5 rounded-full text-sm font-semibold 
            bg-green-100 text-green-700
          "
                >
                  Open & Active
                </span>
              </div>
            </div>
          </div>

          {myShopData?.shop?.items?.length === 0 && (
            <div className="flex justify-center items-center mt-4 p-4 sm:p-6">
              <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add Food Items
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">
                    Please add food items to start managing your menu and
                    orders. Join us in serving delicious food to our customers!
                  </p>
                  <Link
                    to="/add-item"
                    className="mt-4 px-4 py-2 bg-[#ff4d2d] cursor-pointer font-semibold text-white rounded-lg hover:bg-[#e04324] transition-colors duration-300"
                  >
                    Add Food Items
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
