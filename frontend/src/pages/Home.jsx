import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard";
import RestaurentOwnerDashboard from "../components/RestaurentOwnerDashboard";
import DeliveryBoyDashboard from "../components/DeliveryBoyDashboard";
import { theme } from "../theme";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  return (
    <div
      className="w-screen min-h-screen pt-10 px-5 flex flex-col gap-5 items-center"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {userData?.role === "User" && <UserDashboard />}
      {userData?.role === "Restaurent Owner" && <RestaurentOwnerDashboard />}
      {userData?.role === "Delivery Boy" && <DeliveryBoyDashboard />}
    </div>
  );
};

export default Home;
