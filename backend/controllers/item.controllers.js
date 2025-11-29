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

    const shop = await Shop.findOne({ owner: req.id });
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
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    res.status(201).json({
      message: "Item created successfully",
      shop,
    });
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
      return res.status(400).json({ message: "Owner and itemId are required" });
    }

    const shop = await Shop.findOne({ owner: owner });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const item = await Item.findOne({ _id: itemId, shop: shop._id });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const { foodName, price, category, foodType } = req.body;

    if (!foodName || price === undefined || !category || !foodType) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let image = item.image;
    if (req.file) {
      image = await uploadToCloudinary(req.file.path);
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        foodName,
        price,
        category,
        foodType,
        image,
      },
      { new: true }
    );

    const updatedShop = await Shop.findOne({ owner: owner });
    await updatedShop.populate("owner");
    await updatedShop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json({
      message: "Item updated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};

export const getItemById = async (req, res) => {
  try {
    const userId = req.id;
    const { itemId } = req.params;

    if (!userId || !itemId) {
      return res.status(400).json({
        message: "User ID and item ID are required fields.",
      });
    }

    const shop = await Shop.findOne({ owner: userId });
    if (!shop || !shop._id) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }

    const shopId = shop._id;

    const item = await Item.findOne({ shop: shopId, _id: itemId });
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json({
      message: "Item fetched by id",
      item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const owner = req.id;
    const { itemId } = req.params;

    const shop = await Shop.findOne({ owner });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    const shopId = shop._id;

    const itemExists = await Item.findOne({ shop: shopId, _id: itemId });
    if (!itemExists) {
      return res.status(404).json({ message: "Item not found." });
    }

    const deletedItem = await Item.findOneAndDelete({
      shop: shopId,
      _id: itemId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Item not found or already deleted.",
      });
    }

    shop.items.pull(deletedItem._id);
    await shop.save();

    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    res.status(200).json({
      message: "Item deleted successfully",
      shop,
    });
  } catch (error) {
    console.error("Delete Item Error:", error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};

export const getItemsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        message: "City parameter is required",
      });
    }

    const shops = await Shop.find({
      city: { $regex: `^${city}$`, $options: "i" },
    });

    if (!shops || shops.length === 0) {
      return res.status(404).json({
        message: "No shops found in the specified city.",
      });
    }

    const shopIds = shops.map((shop) => shop._id);

    const items = await Item.find({ shop: { $in: shopIds } });

    if (!items.length) {
      return res.status(404).json({
        message: "No items found in this city.",
      });
    }

    res.status(200).json({
      message: "Shop items fetched successfully",
      items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
};

export const getItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(400).json("shop not found");
    }
    return res.status(200).json({
      shop,
      items: shop.items,
    });
  } catch (error) {
    return res.status(500).json({ message: `Get item by shop error ${error}` });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;
    if (!query || !city) {
      return null;
    }
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    if (!shops) {
      return res.status(400).json({ message: "shops not found" });
    }

    const shopIds = shops.map((s) => s._id);
    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { foodName: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("shop", "shopName image");

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: `Search item  error ${error}` });
  }
};

export const rating = async (req, res) => {
  try {
    const { itemId, rating } = req.body;

    if (!itemId || !rating) {
      return res.status(400).json({ message: "itemId and rating is required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 to 5" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const newCount = item.ratings.count + 1;
    const newAverage =
      (item.ratings.average * item.ratings.count + rating) / newCount;

    item.ratings.count = newCount;
    item.ratings.average = newAverage;
    await item.save();
    return res.status(200).json({ ratings: item.ratings });
  } catch (error) {
    return res.status(500).json({ message: `rating error ${error}` });
  }
};
