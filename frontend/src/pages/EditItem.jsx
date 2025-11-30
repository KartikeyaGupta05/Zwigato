import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

function EditItem() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);

  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const handleUploadClick = () => {
    document.getElementById("fileInputEdit").click();
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-id/${itemId}`,
          { withCredentials: true }
        );
        setCurrentItem(result.data);
      } catch {}
    };
    fetchItem();
  }, [itemId]);

  useEffect(() => {
    setName(currentItem?.name || "");
    setPrice(currentItem?.price || "");
    setCategory(currentItem?.category || "");
    setFoodType(currentItem?.foodType || "");
    setFrontendImage(currentItem?.image || "");
  }, [currentItem]);

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-[#fff9f6] min-h-screen relative">
      <div
        className="absolute top-6 left-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={40} className="text-[#ff4d2d]" />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Edit Food
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Food Name
            </label>
            <input
              type="text"
              placeholder="Enter food name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Upload Image
            </label>

            <div
              onClick={handleUploadClick}
              className="w-full h-40 border-2 border-dashed border-orange-300 rounded-xl flex items-center justify-center cursor-pointer bg-orange-50 hover:bg-orange-100 transition"
            >
              {!frontendImage ? (
                <div className="text-center">
                  <FaUtensils className="text-orange-400 text-3xl mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">
                    Click to upload image
                  </p>
                </div>
              ) : (
                <img
                  src={frontendImage}
                  className="w-full h-full rounded-xl object-cover"
                />
              )}
            </div>

            <input
              id="fileInputEdit"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Price
            </label>
            <input
              type="number"
              placeholder="₹0"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Category
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c, i) => (
                <option value={c} key={i}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Food Type
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option value="veg">Veg</option>
              <option value="non veg">Non Veg</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 active:scale-95 transition-all duration-200"
          >
            {loading ? (
              <ClipLoader size={20} color="white" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;
