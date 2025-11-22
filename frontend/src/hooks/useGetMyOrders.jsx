import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/reducer/userSlice";
import axios from "axios";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/order/my-orders`,
          { withCredentials: true }
        );
        dispatch(setMyOrders(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, [userData]);
}

export default useGetMyOrders;
