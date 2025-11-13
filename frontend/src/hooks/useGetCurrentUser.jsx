import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/reducer/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/current-user`, {
          withCredentials: true,
        });
        dispatch(setUserData(response.data));
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);
}

export default useGetCurrentUser;
