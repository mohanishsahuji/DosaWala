import express from "express";
import passport from "passport";
import { getAdminStats, getAdminUsers, logout, myProfile } from "../controller/User.js";
import {authorizeAdmin, isAuthenticated} from "../middleware/Auth.js";
const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"],
  }),(req,res)=>{
   res.send("<h1>hello</h1>")
  }
);
router.get(
  "/login",
  passport.authenticate(
    "google"
    ,{
        scope:["profile"],
        successRedirect:process.env.FRONTEND_URL
    }
  ),
  (req, res) => {
    res.send("logged in");
  }
);

router.get("/me", isAuthenticated, myProfile);
router.get("/logout", logout);
router.get("/admin/users",isAuthenticated,authorizeAdmin,getAdminUsers)
router.get("/admin/stats",isAuthenticated,authorizeAdmin,getAdminStats)

export default router;
