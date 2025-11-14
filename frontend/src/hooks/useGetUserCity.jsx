import React, { use, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserCity, setUserState, setUserAddress} from "../redux/reducer/userSlice";

function useGetUserCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${
            import.meta.env.VITE_GEO_API_KEY
          }`
        );
        const city = response?.data?.results[0].city;
        dispatch(setUserCity(city));
        const state = response?.data?.results[0].state;
        dispatch(setUserState(state));
        const address = response?.data?.results[0].formatted;
        dispatch(setUserAddress(address));
      } catch (error) {
        console.error("Error fetching user city:", error);
      }
    });
  }, [userData]);
}

export default useGetUserCity;
