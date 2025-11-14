import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    category: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    foodType: {
      type: String,
      enum: ["Veg", "Non-Veg", "Vegan"],
      required: true,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);


export default Item;
