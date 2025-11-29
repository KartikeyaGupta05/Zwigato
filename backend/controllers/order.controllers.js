import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (cartItems.length == 0 || !cartItems) {
      return res.status(400).json({ message: "Cart is Empty" });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res
        .status(400)
        .json({ message: "Send complete Delivery Address" });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          throw new Error(`Shop not found with ID: ${shopId}`);
        }
        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            name: i.foodName,
            price: i.price,
            quantity: i.quantity,
          })),
        };
      })
    );

    const orderId = `ORD_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    if (paymentMethod == "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      const newOrder = await Order.create({
        orderId,
        user: req.id,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });

      return res.status(200).json({
        razorOrder,
        orderId: newOrder._id,
      });
    }

    const newOrder = await Order.create({
      orderId,
      user: req.id,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "foodName image price"
    );
    await newOrder.populate("shopOrders.shop", "shopName");
    await newOrder.populate("user", "fullName email contact");
    await newOrder.populate("shopOrders.owner", "fullName socketId");

    const io = req.app.get("io");

    if (io) {
      newOrder.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            user: newOrder.user,
            shopOrders: shopOrder,
            createdAt: newOrder.createdAt,
            deliveryAddress: newOrder.deliveryAddress,
            payment: newOrder.payment,
          });
        }
      });
    }

    return res.status(201).json(newOrder);
  } catch (error) {
    console.log("Place order error:", error);
    return res.status(500).json({ message: `Place order error: ${error}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status != "captured") {
      return res.status(400).json({ message: "payment not captured" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await order.populate(
      "shopOrders.shopOrderItems.item",
      "foodName image price"
    );
    await order.populate("shopOrders.shop", "shopName");
    await order.populate("shopOrders.owner", "fullName socketId");
    await order.populate("user", "fullName email contact");

    const io = req.app.get("io");

    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrders: shopOrder,
            createdAt: order.createdAt,
            deliveryAddress: order.deliveryAddress,
            payment: order.payment,
          });
        }
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: `verify payment  error ${error}` });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (user.role == "user") {
      const orders = await Order.find({ user: req.id })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "shopName")
        .populate("shopOrders.owner", "fullName email contact")
        .populate("shopOrders.shopOrderItems.item", "foodName image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName contact");

      return res.status(200).json(orders);
    } else if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.id })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "shopName")
        .populate("user", "fullName email contact")
        .populate("shopOrders.owner", "fullName email contact")
        .populate("shopOrders.shopOrderItems.item", "foodName image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName contact");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.id),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        payment: order.payment,
      }));

      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res.status(500).json({ message: `Get User order error ${error}` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);

    const shopOrder = order.shopOrders.find((o) => o.shop == shopId);
    if (!shopOrder) {
      return res.status(400).json({ message: "shop order not found" });
    }
    shopOrder.status = status;
    let deliveryBoysPayload = [];
    if (status == "out of delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );
      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();
        return res.json({
          message:
            "Order status updated but there is no available delivery boys",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order?._id,
        shop: shopOrder?.shop,
        shopOrderId: shopOrder?._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        contact: b.contact,
      }));

      await deliveryAssignment.populate("order");
      await deliveryAssignment.populate("shop");

      const io = req.app.get("io");
      if (io) {
        availableBoys.forEach((boy) => {
          const boySocketId = boy.socketId;
          if (boySocketId) {
            io.to(boySocketId).emit("newAssignment", {
              sentTo: boy._id,
              assignmentId: deliveryAssignment._id,
              orderId: deliveryAssignment.order._id,
              shopName: deliveryAssignment.shop.shopName,
              deliveryAddress: deliveryAssignment.order.deliveryAddress,
              items:
                deliveryAssignment.order.shopOrders.find((so) =>
                  so._id.equals(deliveryAssignment.shopOrderId)
                ).shopOrderItems || [],
              subtotal: deliveryAssignment.order.shopOrders.find((so) =>
                so._id.equals(deliveryAssignment.shopOrderId)
              )?.subtotal,
            });
          }
        });
      }
    }

    await order.save();
    const updatedShopOrder = order.shopOrders?.find((o) => o.shop == shopId);
    await order.populate("shopOrders.shop", "shopName");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email contact"
    );
    await order.populate("user", "socketId");

    const io = req.app.get("io");
    if (io) {
      const userSocketId = order.user.socketId;
      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment?._id,
    });
  } catch (error) {
    return res.status(500).json({ message: `order status error ${error}` });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.id;
    const assignments = await DeliveryAssignment.find({
      brodcastedTo: deliveryBoyId,
      status: "brodcasted",
    });

    await assignments.populate("order");
    await assignments.populate("shop");

    const formated = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.shopName,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          .shopOrderItems || [],
      subtotal: a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
        ?.subtotal,
    }));

    return res.status(200).json(formated);
  } catch (error) {
    return res.status(500).json({ message: `get Assignment error ${error}` });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(400).json({ message: "assignment not found" });
    }
    if (assignment.status !== "brodcasted") {
      return res.status(400).json({ message: "assignment is expired" });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.id,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "You are already assigned to another order" });
    }

    assignment.assignedTo = req.id;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();

    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    let shopOrder = order.shopOrders.id(assignment.shopOrderId);
    shopOrder.assignedDeliveryBoy = req.id;
    await order.save();

    return res.status(200).json({
      message: "order accepted",
    });
  } catch (error) {
    return res.status(500).json({ message: `Accept order error ${error}` });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.id,
      status: "assigned",
    })
      .populate("shop", "shopName")
      .populate("assignedTo", "fullName email contact location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName email location contact" }],
      });

    if (!assignment) {
      return res.status(400).json({ message: "assignment not found" });
    }
    if (!assignment.order) {
      return res.status(400).json({ message: "order not found" });
    }

    const shopOrder = assignment.order.shopOrders?.find(
      (so) => String(so._id) == String(assignment.shopOrderId)
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order  not found" });
    }

    let deliveryBoyLocation = { lat: null, lon: null };
    if (assignment.assignedTo.location.coordinates.length == 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get current order error ${error}` });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: `Get by id order error ${error}` });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!order || !shopOrder) {
      return res.status(400).json({ message: "enter valid order/shopOrderid" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;

    await order.save();
    await sendDeliveryOtpMail(order.user, otp);

    return res
      .status(200)
      .json({ message: `Otp sent Successfuly to ${order?.user?.fullName}` });
  } catch (error) {
    return res.status(500).json({ message: `delivery otp error ${error}` });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const order = await Order.findById(orderId).populate("user");

    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!order || !shopOrder) {
      return res.status(400).json({ message: "enter valid order/shopOrderid" });
    }

    if (
      shopOrder.deliveryOtp !== otp ||
      !shopOrder.otpExpires ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid/Expired Otp" });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();

    await order.save();
    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignedDeliveryBoy,
    });

    return res.status(200).json({ message: "Order Delivered Successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `verify delivery otp error ${error}` });
  }
};

export const getTodayDeliveries = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const startsOfDay = new Date();
    startsOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": deliveryBoyId,
      "shopOrders.status": "delivered",
      "shopOrders.deliveredAt": { $gte: startsOfDay },
    }).lean();

    let todaysDeliveries = [];

    orders.forEach((order) => {
      order.shopOrders.forEach((shopOrder) => {
        if (
          shopOrder.assignedDeliveryBoy == deliveryBoyId &&
          shopOrder.status == "delivered" &&
          shopOrder.deliveredAt &&
          shopOrder.deliveredAt >= startsOfDay
        ) {
          todaysDeliveries.push(shopOrder);
        }
      });
    });

    let stats = {};

    todaysDeliveries.forEach((shopOrder) => {
      const hour = new Date(shopOrder.deliveredAt).getHours();
      stats[hour] = (stats[hour] || 0) + 1;
    });

    let formattedStats = Object.keys(stats).map((hour) => ({
      hour: parseInt(hour),
      count: stats[hour],
    }));

    formattedStats.sort((a, b) => a.hour - b.hour);
    return res.status(200).json(formattedStats);
  } catch (error) {
    return res.status(500).json({ message: `today deliveries error ${error}` });
  }
};
