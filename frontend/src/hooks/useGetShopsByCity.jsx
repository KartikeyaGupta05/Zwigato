import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setShopsInMyCity } from "../redux/reducer/userSlice";
import { useSelector } from "react-redux";

function useGetShopsByCity() {
  const dispatch = useDispatch();
  const { userCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userCity) return;
    const fetchShopsByCity = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/shop/get-shops-by-city/${userCity}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setShopsInMyCity(response.data));
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchShopsByCity();
  }, [userCity]);
}

export default useGetShopsByCity;
