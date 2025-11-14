import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/reducer/ownerSlice";``

function useGetMyShop() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyShop = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/shop/get-myShop`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(response.data));
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchMyShop();
  }, []);
}

export default useGetMyShop;
