import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { validationResult } from "express-validator";

export const itemCreateController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const { foodName, price, category, foodType } = req.body;

    const shop = await Shop.findOne({owner : req.id});
    if (!shop) {
      return res.status(404).json({
        message: "Shop not found.",
      });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }
    const image = await uploadToCloudinary(file.path);

    const item = await Item.create({
      foodName,
      image: image,
      price,
      shop: shop._id,
      category,
      foodType,
    });
    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner items");
    
    res.status(201).json({
      message: "Item created successfully", shop});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};

export const itemUpdatedController = async (req, res) => {
  try {
    const owner = req.id;
    const { itemId } = req.params;

    if (!owner || !itemId) {
      return res.status(400).json({
        message: "Owner and itemId are required",
      });
    }

    const shops = await Shop.findOne({ owner: owner });
    if (!shops) {
      return res.status(404).json({
        message: "shop not found",
      });
    }

    const shopId = shops._id;
    if (!shopId) {
      return res.status(400).json({
        message: "shop are required",
      });
    }

    const itemExists = await Item.findOne({ shop: shopId, _id: itemId });
    if (!itemExists) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const items = await Item.findOne({ shop: shopId, _id: itemId });
    if (!items) {
      return res.status(400).json({
        message: "item not found",
      });
    }

    if (items.shop.toString() !== shopId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this item",
      });
    }

    const { foodName, price, category, foodType } = req.body;
    if (!foodName || !price || !category || !foodType) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "no images uploaded",
      });
    }

    const imageUpload = await uploadToCloudinary(file.path);

    const item = await Item.findOneAndUpdate(
      { _id: itemId },
      {
        foodName,
        price,
        category,
        foodType,
        image: imageUpload,
        shop: shopId,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};