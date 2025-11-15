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

    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

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

    if (!owner || !shopId) {
      return res.status(400).json({
        message: "Owner and shopId are required",
      });
    }

    const shopExists = await Shop.findOne({ owner, _id: shopId });
    if (!shopExists) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }

    const { shopName, city, state, address } = req.body;

    if (!shopName || !city || !state || !address) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let image = shopExists.image;

    if (req.file) {
      image = await uploadToCloudinary(req.file.path);
    }

    await Shop.findOneAndUpdate(
      { owner, _id: shopId },
      { shopName, city, state, address, image },
      { new: true }
    );

    const updatedShop = await Shop.findOne({ owner, _id: shopId });
    await updatedShop.populate("owner");
    await updatedShop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    res.status(200).json({
      message: "Shop updated successfully",
      shop: updatedShop,
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
    const shop = await Shop.findOne({ owner: owner })
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });

    if (!shop) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }
    res.status(200).json({
      message: "Shop fetched successfully",
      shop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};

export const getShopsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        message: "City is required",
      });
    }

    const shops = await Shop.find({
      city: { $regex: `^${city}$`, $options: "i" },
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(404).json({
        message: "No shops found in this city",
      });
    }

    res.status(200).json({
      message: "Shops fetched successfully",
      shops,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};
