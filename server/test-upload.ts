import uploadImageOnCloudinary from "./utils/imageUpload";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const testUpload = async () => {
    console.log("Testing Cloudinary Upload...");

    // Create a dummy buffer (1x1 transparent GIF)
    const buffer = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

    const mockFile: any = {
        fieldname: 'imageFile',
        originalname: 'test.gif',
        encoding: '7bit',
        mimetype: 'image/gif',
        buffer: buffer,
        size: buffer.length
    };

    try {
        console.log("Uploading...");
        const url = await uploadImageOnCloudinary(mockFile);
        console.log("✅ Upload Success!");
        console.log("URL:", url);
    } catch (error) {
        console.error("❌ Upload Failed:", error);
    }
};

testUpload();
