import React from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import theme from "../theme";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/reducer/ownerSlice";

const OwnerItemCard = ({ data }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/item/delete-item/${data._id}`,
        {
          withCredentials: true,
        }
      );

      dispatch(setMyShopData(response.data));
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the item. Please try again.");
    }
  };

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl">
      <div className="w-36 shrink-0 bg-gray-50">
        <img
          src={data.image}
          alt={data.foodName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h2 className="text-base font-semibold text-[#ff4d2d]">
            {data.foodName}
          </h2>

          <p className="text-gray-700 text-sm mt-1">
            <span className="font-medium text-gray-900">Category: </span>
            {data.category}
          </p>

          <p className="text-gray-700 text-sm">
            <span className="font-medium text-gray-900">Food Type: </span>
            {data.foodType}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p
            className=" text-base font-semibold"
            style={{ color: theme.primaryColor }}
          >
            ₹{data.price}
          </p>

          <div className="flex gap-4" style={{ color: theme.primaryColor }}>
            <Link
              to={`/edit-item/${data._id}`}
              className="rounded-full p-2 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor + "20" }}
            >
              <FaPen size={18} />
            </Link>

            <span
              className="rounded-full p-2 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor + "20" }}
              onClick={handleDelete}
            >
              <FaTrashAlt size={18} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
