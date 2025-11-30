import axios from "axios";
import React from "react";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function OwnerItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/delete/${data._id}`,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full max-w-3xl bg-white rounded-2xl border border-orange-200 shadow-md hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300 overflow-hidden">
      <div className="w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0 bg-gray-100">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover rounded-l-2xl"
        />
      </div>

      <div className="flex flex-col justify-between p-4 flex-1">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-900">{data.name}</h2>

          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-800">Category:</span>{" "}
            {data.category}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-800">Food Type:</span>{" "}
            {data.foodType}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-[#ff4d2d] text-xl font-bold">₹{data.price}</div>

          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full border border-orange-300 text-[#ff4d2d] bg-orange-50 hover:bg-[#ff4d2d] hover:text-white transition cursor-pointer duration-200 shadow-sm"
              onClick={() => navigate(`/edit-item/${data._id}`)}
            >
              <FaPen size={15} />
            </button>

            <button
              className="p-2 rounded-full cursor-pointer border border-red-300 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition duration-200 shadow-sm"
              onClick={handleDelete}
            >
              <FaTrashAlt size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
