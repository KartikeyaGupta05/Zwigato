import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setItemsInMyCity } from "../redux/reducer/userSlice";
import { useSelector } from "react-redux";

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { userCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userCity) return;
    const fetchItemsByCity = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/item/getItems-by-city/${userCity}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setItemsInMyCity(response.data));
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchItemsByCity();
  }, [userCity]);
}

export default useGetItemsByCity;
