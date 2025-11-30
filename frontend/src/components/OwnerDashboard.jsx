import React from "react";
import Nav from "./NaV.JSX";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "./ownerItemCard";

function OwnerDashboard() {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Nav />

      {/* When shop is NOT created */}
      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6 mt-8">
          <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-orange-100 hover:shadow-2xl transition-all">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4 drop-shadow-md" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Join Zwigato and reach thousands of customers ready to taste your
                delicious meals.
              </p>
              <button
                className="bg-[#ff4d2d] text-white px-6 py-2.5 rounded-full font-medium shadow-md cursor-pointer hover:bg-[#e64323] transition"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* When shop IS created */}
      {myShopData && (
        <div className="w-full flex flex-col items-center gap-8 px-4 sm:px-6 mt-10">

          {/* Shop Header Card */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 flex items-center gap-3 text-center">
            <FaUtensils className="text-[#ff4d2d] w-12 h-12 drop-shadow-md" />
            Welcome to {myShopData.name}
          </h1>

          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">
            
            <div
              className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md hover:bg-[#e64323] transition cursor-pointer"
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen size={18} />
            </div>

            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-48 sm:h-64 object-cover"
            />

            <div className="p-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {myShopData.name}
              </h1>

              <p className="text-gray-600">
                {myShopData.city}, {myShopData.state}
              </p>
              <p className="text-gray-500 mt-1">{myShopData.address}</p>
            </div>
          </div>

          {/* If NO Items */}
          {myShopData.items.length === 0 && (
            <div className="flex justify-center items-center p-4 sm:p-6">
              <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-orange-100 hover:shadow-2xl transition-all">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4 drop-shadow-md" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Add Food Items
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Start adding dishes to your menu and attract hungry customers!
                  </p>

                  <button
                    className="bg-[#ff4d2d] text-white px-6 py-2.5 rounded-full cursor-pointer font-medium shadow-md hover:bg-[#e64323] transition"
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}

          {myShopData.items.length > 0 && (
            <div className="flex flex-col items-center gap-4 w-full max-w-3xl mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Your Menu Items
              </h2>

              <div className="w-full items-center flex flex-col gap-4">
                {myShopData.items.map((item, index) => (
                  <OwnerItemCard data={item} key={index} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
