
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Order } from "./models/order.model";

dotenv.config();

const verifyOrders = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing in .env");
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const orders = await Order.find().sort({ createdAt: -1 }).limit(5);

        console.log(`Found ${orders.length} recent orders:`);
        orders.forEach(order => {
            console.log("------------------------------------------------");
            console.log(`Order ID: ${order._id}`);
            console.log(`Created At: ${order.createdAt}`);
            console.log(`Total Amount (DB Value): ${order.totalAmount}`);
            console.log(`Cart Items: ${order.cartItems?.length || 0}`);
            if (order.cartItems && order.cartItems.length > 0) {
                // Inspect first item to see structure
                console.log(`First Item Price: ${order.cartItems[0].price}`);
                console.log(`First Item Qty: ${order.cartItems[0].quantity}`);
            }
        });

    } catch (error) {
        console.error("Error verifying orders:", error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyOrders();
