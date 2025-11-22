import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { removeCartItem, updateQuantity } from "../redux/reducer/userSlice";

function CartItemCard({ data }) {
  const dispatch = useDispatch();

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md border border-orange-100 hover:shadow-lg transition">

      <div className="flex items-center gap-4">
        <img
          src={
            data.image ||
            "https://cdn-icons-png.flaticon.com/512/2769/2769603.png"
          }
          alt={data.name}
          className="w-20 h-20 object-cover rounded-lg border shadow-sm"
        />

        <div className="flex flex-col">
          <h1 className="font-semibold text-[17px] text-gray-800">
            {data.name}
          </h1>

          <p className="text-sm text-gray-500">
            ₹{data.price} x {data.quantity}
          </p>

          <p className="text-lg font-bold text-[#ff4d2d]">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (Quantity + Delete) */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() => handleDecrease(data.id, data.quantity)}
        >
          <FaMinus size={12} />
        </button>

        <span className="font-semibold">{data.quantity}</span>

        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() => handleIncrease(data.id, data.quantity)}
        >
          <FaPlus size={12} />
        </button>

        {/* DELETE BUTTON */}
        <button
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 cursor-pointer"
          onClick={() => dispatch(removeCartItem(data.id))}
        >
          <CiTrash size={20} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
