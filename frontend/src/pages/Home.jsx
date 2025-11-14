import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoyDashboard from "../components/DeliveryBoyDashboard";
import theme from "../theme";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  return (
    (
      <div
        className="w-screen min-h-screen px-5 flex flex-col gap-5 items-center"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        
        {userData?.user?.role?.toLowerCase() === "user" && <UserDashboard />}
        {userData?.user?.role?.toLowerCase() === "owner" && <OwnerDashboard />}
        {userData?.user?.role?.toLowerCase() === "deliveryboy" && <DeliveryBoyDashboard />}
      </div>
    )
  );
};

export default Home;
