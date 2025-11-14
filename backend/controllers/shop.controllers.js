import Shop from "../models/shop.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { validationResult } from "express-validator";

export const shopCreateController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { shopName, state, city, address } = req.body;
    const owner = req.id;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "no file uploaded",
      });
    }

    const image = await uploadToCloudinary(file.path);

    const shop = await Shop.create({
      shopName,
      image: image,
      owner,
      address,
      city,
      state,
    });

    await shop.populate("owner items");

    res.status(201).json({
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};

export const shopUpdatedController = async (req, res) => {
  try {
    const owner = req.id;
    const { shopId } = req.params;

    if ( !owner || !shopId) {
      return res.status(400).json({
        message: "Owner and shopId are required",
      });
    }

    const shops = await Shop.findOne({ owner: owner, _id: shopId });
    if (!shops) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }

    const { shopName, city, state, address } = req.body;

    let image = shops.image;

    const file = req.file;
    if (file) {
      image = await uploadToCloudinary(file.path);
    }

    const shop = await Shop.findOneAndUpdate(
      { owner: owner, _id: shopId },
      { shopName, city, state, address, image },
      { new: true }
    );

    res.status(200).json({
      message: "Shop updated successfully",
      shop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};

export const getMyShopController = async (req, res) => {
  try {
    const owner = req.id;
    const shop = await Shop.findOne({ owner: owner }).populate("owner");

    if (!shop) {
      return null;
    }
    res.status(200).json({
      message: "Shop fetched successfully",
      shop,
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
}