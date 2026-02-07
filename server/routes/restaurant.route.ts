import express from "express"
import { createRestaurant, getRestaurant, getRestaurantOrder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant, debugAllRestaurants, devSearch } from "../controller/restaurant.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthenticated, getRestaurant);
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateRestaurant);
router.route("/order").get(isAuthenticated, getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/search/:searchText").get(searchRestaurant);

// Dev-only debug route: returns all restaurants (skip auth in development)
if (process.env.NODE_ENV !== 'production') {
    router.route("/debug-all").get(debugAllRestaurants);
    router.route("/dev-search").get(devSearch);
}

router.route("/:id").get(isAuthenticated, getSingleRestaurant);

export default router;

