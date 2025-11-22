import React, { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/reducer/ownerSlice";
import { FaUtensils } from "react-icons/fa6";
import theme from "../theme";

const AddItem = () => {
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
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
  const foodTypes = ["Veg", "Non-Veg", "Vegan"];
  const [foodType, setFoodType] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      formData.append("foodName", itemName);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      if (backendImage) formData.append("image", backendImage);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/item/add-item`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setMyShopData(response.data));
      setLoading(false);
      toast.success("Item added successfully");
      navigate("/")
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.errors) {
        const fieldsError = {};
        const err = error.response.data.errors;
        err.forEach((e) => {
          fieldsError[e.path] = e.msg;
        });
        setErr(fieldsError);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Internal server error");
      }
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
              style={{
                backgroundColor: theme.primaryColor + "20",
              }}
            >
              <FaUtensils className="text-[#ff4d2d] w-12 h-12 sm:w-14 sm:h-14" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mt-3">
              Add Food Item
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Provide item details carefully
            </p>
          </div>

          <form className="w-full mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold text-gray-700">
                Food Item Name
              </label>
              <input
                type="text"
                placeholder="Enter your food item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none text-gray-700 border-gray-300 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Item Image</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none border-gray-300 bg-white"
              />
            </div>

            {imagePreview && (
              <div className="w-full h-40 rounded-xl border border-orange-300 mt-2 overflow-hidden">
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-gray-700">Price</label>
              <input
                type="number"
                placeholder="Enter your food item price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none text-gray-700 border-gray-300 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none text-gray-700 border-gray-300 focus:border-orange-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Food Types</label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none text-gray-700 border-gray-300 focus:border-orange-500"
              >
                <option value="" disabled>
                  Select a food type
                </option>
                {foodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin rounded-full mx-auto"></div>
              ) : (
                "Add Food Item"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
