import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  // Badge Config
  const type = data.foodType?.toLowerCase();
  const badgeConfig = {
    veg: { color: "bg-green-600", label: "Veg" },
    "non-veg": { color: "bg-red-600", label: "Non-Veg" },
  };
  const badge = badgeConfig[type] || badgeConfig["veg"];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="w-[250px] rounded-2xl border border-orange-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full h-[170px] bg-gray-100 overflow-hidden">
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow flex items-center gap-1 z-10">
          <span className={`w-3 h-3 rounded-full ${badge.color}`}></span>
          <span className="text-xs font-semibold text-gray-700">
            {badge.label}
          </span>
        </div>

        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {data.name}
        </h1>

        <div className="flex items-center gap-2">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <IoMdPeople size={14} /> {data.rating?.count || 0}
          </span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-orange-600 font-semibold text-[17px]">
            ₹{data.price}
          </p>

          {quantity === 0 ? (
            <button
              className="px-4 py-1 bg-[#ff4d2d] cursor-pointer text-white rounded-lg font-semibold text-sm hover:bg-[#e64323] transition"
              onClick={() => setQuantity(1)}
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 bg-white border border-orange-400 px-3 rounded-full shadow-sm">
                <button
                  onClick={() => setQuantity(quantity - 1)}
                  className="text-[#ff4d2d] font-bold text-xl cursor-pointer"
                >
                  -
                </button>

                <span className="text-gray-900 font-semibold">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-[#ff4d2d] font-bold text-xl cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                className={`${
                  cartItems.some((i) => i.id === data._id)
                    ? "bg-gray-700 hover:bg-white hover:text-gray-700"
                    : "bg-[#ff4d2d] hover:bg-white hover:text-[#ff4d2d]"
                } text-white rounded-full shadow cursor-pointer p-2 transition`}
                onClick={() => {
                  quantity > 0 &&
                    dispatch(
                      addToCart({
                        id: data._id,
                        name: data.name,
                        price: data.price,
                        image: data.image,
                        shop: data.shop,
                        quantity,
                        foodType: data.foodType,
                      })
                    );
                }}
              >
                <FaShoppingCart />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
