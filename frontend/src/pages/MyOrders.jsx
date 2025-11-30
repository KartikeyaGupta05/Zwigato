import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { setMyOrders, updateRealtimeOrderStatus } from "../redux/userSlice";
import { FaReceipt } from "react-icons/fa";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if (data.shopOrders?.owner._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    });

    socket?.on("update-status", ({ orderId, shopId, status, userId }) => {
      if (userId == userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      }
    });

    return () => {
      socket?.off("newOrder");
      socket?.off("update-status");
    };
  }, [socket]);

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4 py-6">
      <div className="w-full max-w-[800px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={40} className="text-[#ff4d2d]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        <div className="space-y-6">
          {myOrders?.length > 0 ? (
            myOrders.map((order, index) =>
              userData.role === "user" ? (
                <UserOrderCard data={order} key={index} />
              ) : userData.role === "owner" ? (
                <OwnerOrderCard data={order} key={index} />
              ) : null
            )
          ) : (
            <div className="flex flex-col justify-center items-center py-16 bg-white rounded-2xl shadow-md border border-orange-100">
              <div className="bg-orange-100 p-6 rounded-full mb-4">
                <FaReceipt className="text-[#ff4d2d] text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                No Orders Found
              </h2>
              <p className="text-gray-600 text-center px-6 max-w-sm">
                You haven't placed any orders yet. Start exploring delicious
                food and enjoy your meal!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
