import React, { useEffect, useState, useRef } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { ClipLoader } from "react-spinners";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FaMapMarkerAlt, FaBoxOpen, FaWallet, FaClock } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { toast } from "react-toastify";

function DeliveryBoy() {
  const { userData, socket, currentCity } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [otp, setOtp] = useState(["", "", "", ""]); // 4 box OTP
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      (watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setDeliveryBoyLocation({ lat: latitude, lon: longitude });
        socket.emit("updateLocation", {
          latitude,
          longitude,
          userId: userData._id,
        });
      })),
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        };
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0
  );

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });

      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      console.log(result.data);
      await getCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("newAssignment", (data) => {
      setAvailableAssignments((prev) => (prev ? [...prev, data] : [data]));
    });
    return () => {
      socket.off("newAssignment");
    };
  }, [socket]);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true }
      );
      setLoading(false);
      setShowOtpBox(true);
      setMessage("");
      setOtp(["", "", "", ""]);
      console.log(result.data);
      setTimeout(() => otpRefs[0]?.current?.focus(), 80);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getOtpString = () => otp.join("");

  const verifyOtp = async () => {
    setMessage("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp: getOtpString(),
        },
        { withCredentials: true }
      );
      toast.success("OTP verified successfully. Order marked as delivered.");
      setMessage(result.data.message);
      location.reload();
    } catch (error) {
      toast.error("OTP verification failed");
      const errMsg = error?.response?.data?.message || "Invalid OTP";
      setMessage(errMsg);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true }
      );
      setTodayDeliveries(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  const handleOtpChange = (val, idx) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) otpRefs[idx + 1].current.focus();
    if (!val && idx > 0) otpRefs[idx - 1].current.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current.focus();
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-[#fff9f6]">
      <Nav />

      <main className="w-full max-w-[1100px] px-4 md:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <section className="bg-white rounded-2xl shadow-md border border-orange-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#ff4d2d] text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {userData.fullName?.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-xl font-bold capitalize text-[#ff4d2d]">
                Welcome, {userData.fullName}
              </h2>
              <p className="text-sm text-gray-600">
                {currentCity || "Your city"} —{" "}
                <span className="font-semibold text-gray-700">
                  Delivery Partner
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="bg-white border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
              <FaMapMarkerAlt className="text-[#ff4d2d]" />
              <div className="text-sm">
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm font-semibold">
                  {deliveryBoyLocation
                    ? `${deliveryBoyLocation.lat.toFixed(
                        4
                      )}, ${deliveryBoyLocation.lon.toFixed(4)}`
                    : `${userData.location?.coordinates?.[1] || "-"}, ${
                        userData.location?.coordinates?.[0] || "-"
                      }`}
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
              <FaWallet className="text-[#ff4d2d]" />
              <div className="text-sm">
                <div className="text-xs text-gray-500">Today Earning</div>
                <div className="text-sm font-semibold">₹{totalEarning}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {!currentOrder && (
              <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#ff4d2d]">
                    Available Orders
                  </h3>
                  <div className="text-sm text-gray-500">
                    {availableAssignments?.length || 0} open
                  </div>
                </div>

                <div className="space-y-3">
                  {availableAssignments && availableAssignments.length > 0 ? (
                    availableAssignments.map((a, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-lg border hover:shadow-md transition"
                      >
                        <div>
                          <div className="font-semibold">{a?.shopName}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {a?.deliveryAddress?.text}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {a.items?.length || 0} items · ₹{a.subtotal}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            className="px-4 py-2 bg-[#ff4d2d] cursor-pointer text-white rounded-lg shadow-sm hover:bg-[#e64323] transition"
                            onClick={() => acceptOrder(a.assignmentId)}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      No available orders currently
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentOrder && (
              <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold">📦 Current Order</h3>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="font-semibold text-sm">
                      {currentOrder?.shopOrder?.shop?.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {currentOrder.deliveryAddress.text}
                    </div>
                    <div className="mt-3 space-y-2">
                      {currentOrder.shopOrder.shopOrderItems.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm text-gray-700 border-b pb-1"
                          >
                            <span className="capitalize">
                              {item.name} x {item.quantity}
                            </span>
                            <span className="font-medium">₹{item.price}</span>
                          </div>
                        )
                      )}

                      <div className="flex justify-between text-sm font-semibold pt-2">
                        <span>Total</span>
                        <span className="text-[#ff4d2d]">
                          ₹{currentOrder.shopOrder.subtotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <DeliveryBoyTracking
                      data={{
                        deliveryBoyLocation: deliveryBoyLocation || {
                          lat: userData.location.coordinates[1],
                          lon: userData.location.coordinates[0],
                        },
                        customerLocation: {
                          lat: currentOrder.deliveryAddress.latitude,
                          lon: currentOrder.deliveryAddress.longitude,
                        },
                      }}
                    />
                  </div>

                  {!showOtpBox ? (
                    <button
                      className="w-full bg-green-500 cursor-pointer text-white font-semibold py-3 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
                      onClick={sendOtp}
                      disabled={loading}
                    >
                      {loading ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Mark as Delivered"
                      )}
                    </button>
                  ) : (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm font-semibold mb-2">
                        Enter OTP for{" "}
                        <span className="text-[#ff4d2d] capitalize">
                          {currentOrder.user.fullName}
                        </span>
                      </div>

                      <div className="flex gap-2 justify-center mb-3">
                        {otp.map((d, i) => (
                          <input
                            key={i}
                            ref={otpRefs[i]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            onKeyDown={(e) => handleOtpKeyDown(e, i)}
                            onChange={(e) => handleOtpChange(e.target.value, i)}
                            className="w-12 h-12 rounded-lg border border-gray-300 text-center text-lg font-semibold focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/30 outline-none"
                          />
                        ))}
                      </div>

                      {message && (
                        <div className="text-center text-sm text-green-600 mb-2">
                          {message}
                        </div>
                      )}

                      <button
                        className="w-full bg-[#ff4d2d] cursor-pointer text-white py-2 rounded-lg font-semibold hover:bg-[#e64323] transition"
                        onClick={verifyOtp}
                      >
                        Submit OTP
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm w-full">
              <h4 className="text-md font-semibold text-[#ff4d2d] mb-3">
                Today Deliveries
              </h4>
              <div style={{ width: "100%", height: 170 }}>
                <ResponsiveContainer>
                  <BarChart data={todayDeliveries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [value, "orders"]}
                      labelFormatter={(label) => `${label}:00`}
                    />
                    <Bar dataKey="count" fill="#ff4d2d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm w-full space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBoxOpen className="text-[#ff4d2d]" />
                  <div>
                    <div className="text-sm text-gray-500">Completed</div>
                    <div className="font-semibold">
                      {todayDeliveries.reduce((s, d) => s + d.count, 0)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Today</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TbTruckDelivery className="text-[#ff4d2d]" />
                  <div>
                    <div className="text-sm text-gray-500">
                      Active Assignments
                    </div>
                    <div className="font-semibold">
                      {availableAssignments?.length || 0}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Now</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaClock className="text-[#ff4d2d]" />
                  <div>
                    <div className="text-sm text-gray-500">Shift</div>
                    <div className="font-semibold">Flexible</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">—</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default DeliveryBoy;
