import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true }
      );
    };

    navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }, [userData]);
}

export default useUpdateLocation;
