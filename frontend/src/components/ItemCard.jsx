import React, { useState } from "react";
import { IoMdPeople } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";

const ItemCard = ({ data }) => {
  const [count, setCount] = useState(0);

  const type = data.foodType;

  const badgeConfig = {
    Veg: { color: "bg-green-600", label: "Veg" },
    "Non-Veg": { color: "bg-red-600", label: "Non-Veg" },
    Vegan: { color: "bg-purple-600", label: "Vegan" },
  };

  const badge = badgeConfig[type] || badgeConfig["Veg"];

  const renderRatings = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <span key={i} className="text-lg text-yellow-500">
            {" "}
            &#9733;{" "}
          </span>
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <span key={i} className="text-lg text-yellow-500">
            {" "}
            &#9734;{" "}
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-lg text-gray-300">
            {" "}
            &#9734;{" "}
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="w-[250px] rounded-2xl border border-orange-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full h-[170px] bg-gray-100">
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow flex items-center gap-1 z-10">
          <span className={`w-3 h-3 rounded-full ${badge.color}`}></span>
          <span className="text-xs font-semibold text-gray-700">
            {badge.label}
          </span>
        </div>

        <img
          src={data.image}
          alt={data.foodName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {data.foodName}
        </h1>

        <div className="flex items-center gap-2">
          {renderRatings(data.ratings?.average || 0)}

          <span className="text-xs text-gray-600 flex items-center gap-1">
            <IoMdPeople size={14} /> {data.ratings?.count || 0}
          </span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-orange-600 font-semibold text-[17px]">
            ₹{data.price}
          </p>

          {count === 0 ? (
            <button
              className="px-4 py-1 bg-orange-500 cursor-pointer text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition"
              onClick={() => setCount(1)}
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 bg-white border border-orange-400 px-3 rounded-full shadow-sm">
                <button
                  onClick={() => setCount(count - 1)}
                  className="text-orange-600 font-bold text-2xl cursor-pointer"
                >
                  -
                </button>
                <span className="text-gray-900 font-semibold">{count}</span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="text-orange-600 font-bold text-2xl cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-white hover:bg-white hover:text-orange-600 bg-orange-600 rounded-full drop-shadow-xl cursor-pointer p-2">
                <FaShoppingCart />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
