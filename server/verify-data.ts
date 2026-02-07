import mongoose from "mongoose";
import dotenv from "dotenv";
import { Restaurant } from "./models/restaurant.model";
import { User } from "./models/user.model";

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to DB.");

        // Find user by email from the snippet
        const user = await User.findOne({ email: "mdraihannahid@gmail.com" });
        if (!user) {
            console.log("❌ User not found!");
            return;
        }
        console.log(`✅ Found User: ${user.fullname} (${user._id})`);

        // Find restaurant linked to this user
        const restaurant = await Restaurant.findOne({ user: user._id });
        if (!restaurant) {
            console.log("❌ No Restaurant found for this user.");
            // Try finding ANY restaurant to see if collection is empty
            const anyRest = await Restaurant.findOne({});
            if (anyRest) {
                console.log("ℹ️  But there are other restaurants in the DB.");
            } else {
                console.log("ℹ️  The 'restaurants' collection appears to be empty.");
            }
        } else {
            console.log("\n✅ Found Restaurant!");
            console.log("------------------------------------------------");
            console.log("Name:", restaurant.restaurantName);
            console.log("Cuisines:", restaurant.cuisines);
            console.log("Delivery Time:", restaurant.deliveryTime);
            console.log("Image URL:", restaurant.imageUrl);
            console.log("------------------------------------------------");
            console.log("NOTE: This data is in the 'restaurants' collection, not 'users'.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

verifyData();
