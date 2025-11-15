import React, { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setMyShopData } from "../redux/reducer/ownerSlice";
import { FaUtensils } from "react-icons/fa6";
import theme from "../theme";

const EditShop = () => {
  const { myShopData } = useSelector((store) => store.owner);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shopId } = useParams();

  const [loading, setLoading] = useState(false);

  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  // Load old values from store
  useEffect(() => {
    if (myShopData?.shop) {
      setShopName(myShopData.shop.shopName);
      setCity(myShopData.shop.city);
      setState(myShopData.shop.state);
      setAddress(myShopData.shop.address);
      setImagePreview(myShopData.shop.image);
    }
  }, [myShopData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("shopName", shopName);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/shop/edit-shop/${shopId}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(response.data));
      toast.success("Shop updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-4 bg-[#fff9f6]">
      <Link className="text-3xl text-gray-500" to="/">
        <GoArrowLeft />
      </Link>

      <div className="w-full mt-8 flex justify-center items-center">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: theme.primaryColor + "20" }}
            >
              <FaUtensils className="text-[#ff4d2d] w-12 h-12 sm:w-14 sm:h-14" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mt-3">
              Edit Your Shop
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Update shop details carefully
            </p>
          </div>

          <form className="w-full mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold text-gray-700">Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none border-gray-300 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Shop Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none border-gray-300 bg-white"
              />
            </div>

            {imagePreview && (
              <div className="w-full h-40 rounded-xl border border-orange-300 mt-2 overflow-hidden">
                <img src={imagePreview} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="font-semibold text-gray-700">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-lg outline-none border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="w-1/2">
                <label className="font-semibold text-gray-700">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-lg outline-none border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none border-gray-300 focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin rounded-full mx-auto"></div>
              ) : (
                "Update Shop"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditShop;
