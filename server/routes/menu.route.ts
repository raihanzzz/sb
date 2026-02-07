import express from "express";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addMenu, editMenu } from "../controller/menu.controller";

const router = express.Router();

// create a menu
router.route("/").post(isAuthenticated, upload.single("imageFile"), addMenu);
router.route("/:id").put(isAuthenticated, upload.single("imageFile"), editMenu);

export default router;

