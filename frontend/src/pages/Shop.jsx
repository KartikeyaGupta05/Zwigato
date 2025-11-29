import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStore, FaLocationDot } from "react-icons/fa6";
import { FaUtensils, FaArrowLeft } from "react-icons/fa";
import ItemCard from "../components/ItemCard";

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();
  const handleShop = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true }
      );
      setShop(response.data.shop);
      setItems(response.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-white to-gray-100">
      <button
        className="fixed top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md 
                 hover:bg-black/80 text-white px-4 py-2 rounded-full shadow-lg 
                 border border-white/20 transition-all active:scale-95"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft size={16} />
        <span className="font-medium">Back</span>
      </button>

      {/* Header Banner */}
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-b-3xl shadow-lg">
          <img
            src={shop.image}
            alt=""
            className="w-full h-full object-cover scale-105 animate-[smoothZoom_12s_ease-in-out_infinite]"
          />

          <div
            className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/20 
                        flex flex-col justify-center items-center text-center px-4"
          >
            <FaStore className="text-white text-4xl mb-3 drop-shadow-2xl" />

            <h1 className="text-3xl md:text-5xl font-black tracking-wide text-orange-500 drop-shadow-xl">
              {shop.shopName}
            </h1>

            <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
              <FaLocationDot size={22} color="red" />
              <p className="text-lg font-semibold text-white drop-shadow">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2
          className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-extrabold 
                     mb-10 text-gray-800 tracking-wide"
        >
          <FaUtensils color="red" />
          <span>Our Menu</span>
        </h2>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
            {items.map((item) => (
              <ItemCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="w-40 h-40 flex items-center justify-center rounded-full bg-linear-to-br from-gray-200 to-gray-300 shadow-inner">
              <FaUtensils className="text-6xl text-gray-500 opacity-60" />
            </div>

            <h3 className="text-2xl font-bold text-gray-700 mt-6">
              No Items Available
            </h3>

            <p className="text-gray-500 text-lg mt-2 text-center max-w-md leading-relaxed">
              Looks like this shop hasn't added anything to the menu yet. Check
              back later or explore other shops!
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md cursor-pointer transition active:scale-95"
            >
              Browse Other Shops
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
