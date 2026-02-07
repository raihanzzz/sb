import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME
});

async function testConnection() {
    console.log("Checking Cloudinary Configuration...");
    console.log("Cloud Name:", process.env.CLOUD_NAME ? "Set" : "Missing");
    console.log("API Key:", process.env.API_KEY ? "Set" : "Missing");
    console.log("API Secret:", process.env.API_SECRET ? "Set" : "Missing");

    try {
        console.log("Attempting to get usage details...");
        const result = await cloudinary.api.usage();
        console.log("Connection Successful!");
        // console.log("Usage details:", result);
    } catch (error: any) {
        console.error("Connection Failed:", error.message);
        if (error.error) {
            console.error("Cloudinary Error Details:", error.error);
        }
    }
}

testConnection();
