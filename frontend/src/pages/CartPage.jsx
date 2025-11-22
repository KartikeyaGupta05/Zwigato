import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center px-4 py-6">
      <div className="w-full max-w-[850px]">

        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="p-1 rounded-full hover:bg-orange-200 transition"
          >
            <IoIosArrowRoundBack size={40} className="text-[#ff4d2d]" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        </div>

        {cartItems?.length === 0 ? (
          <div className="text-center mt-28">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              className="w-40 mx-auto opacity-70"
            />
            <p className="text-gray-600 text-xl font-medium mt-4">
              Your cart is empty
            </p>
            <Link
              to="/"
              className="mt-4 inline-block bg-[#ff4d2d] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e64526] transition cursor-pointer"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems?.map((item, index) => (
                <CartItemCard data={item} key={index} />
              ))}
            </div>

            <div className="mt-6 bg-white p-5 rounded-xl shadow-md border">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-700">
                  Total Amount
                </h1>
                <span className="text-2xl font-bold text-[#ff4d2d]">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                className="bg-[#ff4d2d] text-white px-7 py-3 cursor-pointer rounded-lg text-lg font-semibold shadow hover:bg-[#e64526] active:scale-95 transition"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
