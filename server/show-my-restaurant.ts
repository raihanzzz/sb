import mongoose from "mongoose";
import dotenv from "dotenv";
import { Restaurant } from "./models/restaurant.model";
import { User } from "./models/user.model";

dotenv.config();

const showMyRestaurant = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);

        // 1. Find the user "Raihan"
        const user = await User.findOne({ email: "mdraihannahid@gmail.com" });
        if (!user) {
            console.log("User not found.");
            return;
        }

        // 2. Find the restaurant belonging to this user
        const restaurant = await Restaurant.findOne({ user: user._id });

        if (!restaurant) {
            console.log("No restaurant found for this user.");
        } else {
            console.log("\nHERE IS YOUR RESTAURANT DATA (From 'restaurants' collection):");
            console.log("===========================================================");
            console.log(JSON.stringify(restaurant.toJSON(), null, 2));
            console.log("===========================================================");
            console.log("^^ Look above! This is the record you want to find in MongoDB.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

showMyRestaurant();
