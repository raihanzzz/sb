import mongoose from "mongoose";
import { Restaurant } from "./models/restaurant.model";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mdraihannahid_db_user:qCKCGLksIoR0dDVI@cluster0.d1ezag6.mongodb.net/";

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // List all restaurants
        const allRestaurants = await Restaurant.find({});
        console.log(`Total restaurants: ${allRestaurants.length}`);

        // Reproduce the search logic for "the"
        const searchText = "the";
        const searchQuery = "the";
        const selectedCuisines: string[] = [];

        const query: any = {};
        const orClauses: any[] = [];

        if (searchText) {
            orClauses.push(
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            );
        }

        if (searchQuery) {
            orClauses.push(
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
            );
        }

        if (orClauses.length > 0) {
            query.$or = orClauses;
        }

        if (selectedCuisines.length > 0) {
            const trimmed = selectedCuisines.map((c) => new RegExp(c.trim(), 'i'));
            query.cuisines = { $in: trimmed };
        }

        console.log("\n--- Executing Search Query 'the' ---");
        console.log("Query:", JSON.stringify(query, null, 2));

        const results = await Restaurant.find(query);
        console.log(`Found ${results.length} restaurants matching query.`);
        results.forEach(r => console.log(`MATCH: ${r.restaurantName}`));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
