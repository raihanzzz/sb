import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassord, signup, updateProfile, verifyEmail, toggleAdmin } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassord);
router.route("/profile/update").post(isAuthenticated, updateProfile);
router.route("/profile/toggle-admin").post(isAuthenticated, toggleAdmin);

export default router;