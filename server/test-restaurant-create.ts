import mongoose from "mongoose";
import dotenv from "dotenv";
import { Restaurant } from "./models/restaurant.model";
import { User } from "./models/user.model";

dotenv.config();

const connectDB = async () => {
    try {
        console.log("Connecting to Mongo...");
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected.");
    } catch (error) {
        console.error("Connection failed", error);
        process.exit(1);
    }
};

const testCreate = async () => {
    await connectDB();

    try {
        // 1. Find a user to attach the restaurant to
        const user = await User.findOne({});
        if (!user) {
            console.error("No user found. Cannot test restaurant creation.");
            process.exit(1);
        }
        console.log("Found user:", user._id);

        // 2. Prepare dummy data matching the controller
        const restaurantData = {
            user: user._id,
            restaurantName: "Test Restaurant " + Date.now(),
            city: "Test City",
            country: "Test Country",
            deliveryTime: 30,
            cuisines: ["Momo", "Pizza"], // Array of strings
            imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
        };

        console.log("Attempting to create restaurant with data:", restaurantData);

        // 3. Create
        const restaurant = await Restaurant.create(restaurantData);
        console.log("Restaurant created successfully:", restaurant);

    } catch (error: any) {
        console.error("❌ Restaurant Creation Failed:", error);
        if (error.errors) {
            console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
        }
    } finally {
        await mongoose.connection.close();
    }
};

testCreate();
