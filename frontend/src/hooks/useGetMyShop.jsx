import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/reducer/ownerSlice";
import { useSelector } from "react-redux";

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchMyShop = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/shop/get-myShop`,
          {
            withCredentials: true,
          }
        );
        dispatch(setMyShopData(response.data));
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchMyShop();
  }, [userData]);
}

export default useGetMyShop;
