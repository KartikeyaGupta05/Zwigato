import React, { useEffect, useRef, useState } from "react";
import UserNavbar from "./UserNavbar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import theme from "../theme";
import { useSelector } from "react-redux";
import ItemCard from "./ItemCard";

const UserDashboard = () => {
  const catScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const itemScrollRef = useRef(null);
  const [showLeftCatButton, setShowLeftCatButton] = useState(false);
  const [showRightCatButton, setShowRightCatButton] = useState(true);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const { userCity, shopsInMyCity, itemsInMyCity } = useSelector((state) => state.user);

  const updateButtonVisibility = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setLeftButton(scrollLeft > 0);
      setRightButton(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const ref = catScrollRef;
    if (ref.current) {
      ref.current.addEventListener("scroll", () => {
        updateButtonVisibility(
          ref,
          setShowLeftCatButton,
          setShowRightCatButton
        );
      });
    }
    const shopRef = shopScrollRef;
    if (shopRef.current) {
      shopRef.current.addEventListener("scroll", () => {
        updateButtonVisibility(
          shopRef,
          setShowLeftShopButton,
          setShowRightShopButton
        );
      });
    }
    
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <UserNavbar />
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5 mt-30">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>

        <div className="w-full relative flex items-center">
          {showLeftCatButton && (
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full z-9999 p-2 shadow text-white cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
              onClick={() => scrollHandler(catScrollRef, "left")}
            >
              <FaCircleChevronLeft size={18} />
            </button>
          )}
          <div
            ref={catScrollRef}
            className="w-full flex overflow-x-auto gap-4 pb-2"
          >
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} />
            ))}
          </div>
          {showRightCatButton && (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full z-9999 p-2 shadow text-white cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
              onClick={() => scrollHandler(catScrollRef, "right")}
            >
              <FaCircleChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5 mt-5">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {userCity}
        </h1>

        <div className="w-full relative flex items-center">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full z-9999 p-2 shadow text-white cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft size={18} />
            </button>
          )}
          {shopsInMyCity &&
            shopsInMyCity.shops &&
            shopsInMyCity.shops.length > 0 && (
              <div
                ref={shopScrollRef}
                className="w-full flex overflow-x-auto gap-4 pb-2"
              >
                {shopsInMyCity.shops.map((shop, index) => (
                  <CategoryCard
                    key={index}
                    name={shop.shopName}
                    image={shop.image}
                  />
                ))}
              </div>
            )}

          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full z-9999 p-2 shadow text-white cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5 mt-5">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Popular Items in {userCity}
        </h1>

        <div className="w-full h-auto flex flex-wrap gap-4 justify-center" >
          {itemsInMyCity &&
            itemsInMyCity.items &&
            itemsInMyCity.items.length > 0 &&
            itemsInMyCity.items.map((item, index) => (
              <ItemCard
                key={index}
                data={item}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
