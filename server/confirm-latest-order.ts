
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Order } from "./models/order.model";

dotenv.config();

const confirmLatestOrder = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing in .env");
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Find the most recent order that is pending
        const latestOrder: any = await Order.findOne({ status: "pending" }).sort({ createdAt: -1 });

        if (!latestOrder) {
            console.log("No pending orders found.");
            return;
        }

        console.log(`Found pending order: ${latestOrder._id}`);

        latestOrder.status = "confirmed";
        // If you had a paymentStatus field, you'd update it here too.

        await latestOrder.save();
        console.log("✅ Order status updated to 'confirmed' successfully!");

    } catch (error) {
        console.error("Error updating order:", error);
    } finally {
        await mongoose.disconnect();
    }
};

confirmLatestOrder();
