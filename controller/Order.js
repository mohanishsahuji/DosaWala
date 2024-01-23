
import { asyncError } from "../middleware/newError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { instance } from "../App.js";
import crypto from "crypto";
import {Payment} from "../models/Payment.js"

export const placeOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    orderStatus,
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    orderStatus,
    user,
  };
  await Order.create(orderOptions);

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully via Cash on Delivery",
  });
});
export const placeOrderOnline = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    orderStatus,
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    orderStatus,
    user,
  };
  const options = {
    amount: Number(totalAmount) * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  const order = await instance.orders.create(options);

  res.status(201).json({
    success: true,
    order,
    orderOptions,
  });
});
export const paymentVerification = asyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderOptions,
  } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

    const isAuthentic=expectedSign === razorpay_signature

    if(isAuthentic){
        const payment=await Payment.create({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        })

        await Order.create({
          ...orderOptions,
          paidAt:new Date(Date.now()),
          paymentInfo:payment._id
        })


        res.status(201).json({
          success:true,
          message:`Order placed succesfully : Payment Id :${payment._id}`
        })
    }else{
      return next(new ErrorHandler("Payment Failed",400))
    }
});

export const getMyorder = asyncError(async (req, res, next) => {
  const orders = await User.find({
  })
  if(orders){
  res.send(`true ${orders}`)}
else{res.send(`false ${orders}`)};
});

export const getOrderDetails = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name");
  if (!order) {
    return next(new ErrorHandler("Invalid Order Id", 403));
  }
  res.status(201).json({
    success: true,
    order,
  });
});
export const clientId = asyncError(async (req, res, next) => {
  
const CclientID=process.env.CLIENT_ID
const CclientSecret=process.env.SECRET
const CcallbackURL=process.env.CALLBACK_URL

const a = typeof CclientID
const b = typeof CclientSecret
const c = typeof CcallbackURL

res.send(`<h1> ${a,b,c} ${CclientID,CclientSecret,CcallbackURL}</h1>`)
});

export const getAdminorder = asyncError(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "name");

  res.status(201).json({
    success: true,
    orders,
  });
});
export const processOrder = asyncError(async (req, res, next) => {
  console.log("process order working");
  const order = await Order.findById(req.params.id);
  if (!order) {
    console.log("!order");
    return next(new ErrorHandler("Invalid Order Id", 403));
  }
  if (order.orderStatus == "Preparing") {
    console.log("preparing");
    order.orderStatus = "Shipped";
  } else if (order.orderStatus == "Shipped") {
    console.log("delivered");
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date(Date.now());
  } else if (order.orderStatus == "Delivered") {
    console.log("Delivered");
    return next(new ErrorHandler("Food Already Delivered", 400));
  }
  await order.save();
  res.status(201).json({
    success: true,
    message: "Status Updated succesfully",
  });
});
