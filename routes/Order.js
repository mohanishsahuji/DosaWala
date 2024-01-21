import express from "express";
import {authorizeAdmin, isAuthenticated} from "../middleware/Auth.js";
import { placeOrder,getMyorder, getOrderDetails, getAdminorder, processOrder, placeOrderOnline, paymentVerification } from "../controller/Order.js";

const router=express.Router()

router.post("/createorder",placeOrder)
router.post("/createorderonline",isAuthenticated,placeOrderOnline)
router.post("/paymentverification",isAuthenticated,paymentVerification)
router.get("/myorder",getMyorder)
router.get("/order/:id",isAuthenticated,getOrderDetails)
//add admin middleware
router.get("/admin/order",isAuthenticated,authorizeAdmin,getAdminorder)
router.get("/admin/order/:id",isAuthenticated,authorizeAdmin,processOrder)
export default router

