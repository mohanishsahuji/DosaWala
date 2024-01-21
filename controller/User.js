
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { asyncError } from "../middleware/newError.js";

export const myProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.clearCookie("connect.sid");
    res.status(200).json({
      message: "looged out",
    });
  });
};
export const getAdminUsers = asyncError(async (req, res, next) => {
  const orders = await User.find({});

  res.status(201).json({
    success: true,
    orders,
  });
});
export const getAdminStats = asyncError(async (req, res, next) => {
  const userCount = await User.countDocuments();

  const orders = await Order.find({});

  const preparingOrders = orders.filter((i) => i.orderStatus === "Preparing");
  const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
  const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");

  let totalIncome = 0;
  orders.forEach((i) => {
    totalIncome += i.totalAmount;
  });

  res.status(201).json({
    success: true,
    userCount,
    totalIncome,
    ordersCount: {
      total: orders.length,
      preparingOrders: preparingOrders.length,
      shippedOrders: shippedOrders.length,
      deliveredOrders: deliveredOrders.length,
    },
  });
});
