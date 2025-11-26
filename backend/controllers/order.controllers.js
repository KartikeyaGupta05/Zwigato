import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

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
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        };
      })
    );

    const orderId = `ORD_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // if (paymentMethod == "online") {
    //     const razorOrder = await instance.orders.create({
    //         amount: Math.round(totalAmount * 100),
    //         currency: 'INR',
    //         receipt: `receipt_${Date.now()}`
    //     })
    //     const newOrder = await Order.create({
    //         orderId,
    //         user: req.id,
    //         paymentMethod,
    //         deliveryAddress,
    //         totalAmount,
    //         shopOrders,
    //         razorpayOrderId: razorOrder.id,
    //         payment: false
    //     })

    //     return res.status(200).json({
    //         razorOrder,
    //         orderId: newOrder._id,
    //     })

    // }

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
    await newOrder.populate("shopOrders.owner", "fullName");
    // await newOrder.populate("shopOrders.owner", "fullName socketId")
    await newOrder.populate("user", "fullName email contact");

    // const io = req.app.get('io')

    // if (io) {
    //     newOrder.shopOrders.forEach(shopOrder => {
    //         const ownerSocketId = shopOrder.owner.socketId
    //         if (ownerSocketId) {
    //             io.to(ownerSocketId).emit('newOrder', {
    //                 _id: newOrder._id,
    //                 paymentMethod: newOrder.paymentMethod,
    //                 user: newOrder.user,
    //                 shopOrders: shopOrder,
    //                 createdAt: newOrder.createdAt,
    //                 deliveryAddress: newOrder.deliveryAddress,
    //                 payment: newOrder.payment
    //             })
    //         }
    //     });
    // }

    return res.status(201).json(newOrder);
  } catch (error) {
    console.log("Place order error:", error);
    return res
      .status(500)
      .json({ message: `Place order error: ${error.message}` });
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
        .populate("shopOrders.shopOrderItems.item", "foodName image price");

      return res.status(200).json(orders);
    } else if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.id })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "shopName")
        .populate("user")
        .populate("shopOrders.owner", "fullName email contact")
        .populate("shopOrders.shopOrderItems.item", "foodName image price");
      // .populate("shopOrders.assignedDeliveryBoy", "fullName contact");

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
    // if (status == "out of delivery" && !shopOrder.assignment) {
    //   const { longitude, latitude } = order.deliveryAddress;
    //   const nearByDeliveryBoys = await User.find({
    //     role: "deliveryBoy",
    //     location: {
    //       $near: {
    //         $geometry: {
    //           type: "Point",
    //           coordinates: [Number(longitude), Number(latitude)],
    //         },
    //         $maxDistance: 5000,
    //       },
    //     },
    //   });

    //   // const nearByIds = nearByDeliveryBoys.map((b) => b._id);
    //   // const busyIds = await DeliveryAssignment.find({
    //   //   assignedTo: { $in: nearByIds },
    //   //   status: { $nin: ["brodcasted", "completed"] },
    //   // }).distinct("assignedTo");

    //   // const busyIdSet = new Set(busyIds.map((id) => String(id)));

    // //   const availableBoys = nearByDeliveryBoys.filter(
    // //     (b) => !busyIdSet.has(String(b._id))
    // //   );
    // //   const candidates = availableBoys.map((b) => b._id);

    // //   if (candidates.length == 0) {
    // //     await order.save();
    // //     return res.json({
    // //       message:
    // //         "order status updated but there is no available delivery boys",
    // //     });
    //   }

    //   const deliveryAssignment = await DeliveryAssignment.create({
    //     order: order?._id,
    //     shop: shopOrder.shop,
    //     shopOrderId: shopOrder?._id,
    //     brodcastedTo: candidates,
    //     status: "brodcasted",
    //   });

    //   shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
    //   shopOrder.assignment = deliveryAssignment._id;
    //   deliveryBoysPayload = availableBoys.map((b) => ({
    //     id: b._id,
    //     fullName: b.fullName,
    //     longitude: b.location.coordinates?.[0],
    //     latitude: b.location.coordinates?.[1],
    //     mobile: b.mobile,
    //   }));

    //   await deliveryAssignment.populate("order");
    //   await deliveryAssignment.populate("shop");
    //   const io = req.app.get("io");
    //   if (io) {
    //     availableBoys.forEach((boy) => {
    //       const boySocketId = boy.socketId;
    //       if (boySocketId) {
    //         io.to(boySocketId).emit("newAssignment", {
    //           sentTo: boy._id,
    //           assignmentId: deliveryAssignment._id,
    //           orderId: deliveryAssignment.order._id,
    //           shopName: deliveryAssignment.shop.name,
    //           deliveryAddress: deliveryAssignment.order.deliveryAddress,
    //           items:
    //             deliveryAssignment.order.shopOrders.find((so) =>
    //               so._id.equals(deliveryAssignment.shopOrderId)
    //             ).shopOrderItems || [],
    //           subtotal: deliveryAssignment.order.shopOrders.find((so) =>
    //             so._id.equals(deliveryAssignment.shopOrderId)
    //           )?.subtotal,
    //         });
    //       }
    //     });
    //   }
    // }

    // await order.save();
    // const updatedShopOrder = order.shopOrders.find((o) => o.shop == shopId);
    // await order.populate("shopOrders.shop", "name");
    // await order.populate(
    //   "shopOrders.assignedDeliveryBoy",
    //   "fullName email mobile"
    // );
    // await order.populate("user", "socketId")

    // const io = req.app.get('io')
    // if (io) {
    //     const userSocketId = order.user.socketId
    //     if (userSocketId) {
    //         io.to(userSocketId).emit('update-status', {
    //             orderId: order._id,
    //             shopId: updatedShopOrder.shop._id,
    //             status: updatedShopOrder.status,
    //             userId: order.user._id
    //         })
    //     }
    // }

    // return res.status(200).json({
    //   shopOrder: updatedShopOrder,
    //   assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
    //   availableBoys: deliveryBoysPayload,
    //   assignment: updatedShopOrder?.assignment?._id,
    // });
    await shopOrder.save();
    return res.status(200).json({
      shopOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: `order status error ${error}` });
  }
};
