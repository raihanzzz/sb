import http from "http";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "./models/user.model";
import { Restaurant } from "./models/restaurant.model";

dotenv.config();

// Connect DB to get a user
const prepare = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI!);
    }
    const user = await User.findOne({});
    if (!user) throw new Error("No user found");

    // Clean up any existing restaurant for this user to avoid 400 "Restaurant already exists"
    await Restaurant.deleteMany({ user: user._id });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, { expiresIn: "1h" });
    return token;
};

const run = async () => {
    try {
        const token = await prepare();
        console.log("Token generated.");

        const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
        const filename = "test-image.png";

        // 1x1 PNG Buffer
        const fileContent = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg==", "base64");

        const bodyParts = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="restaurantName"',
            '',
            'E2E Test Restaurant',
            `--${boundary}`,
            'Content-Disposition: form-data; name="city"',
            '',
            'Test City',
            `--${boundary}`,
            'Content-Disposition: form-data; name="country"',
            '',
            'Test Country',
            `--${boundary}`,
            'Content-Disposition: form-data; name="deliveryTime"',
            '',
            '30',
            `--${boundary}`,
            'Content-Disposition: form-data; name="cuisines"',
            '',
            '["TestCuisine"]',
            `--${boundary}`,
            `Content-Disposition: form-data; name="imageFile"; filename="${filename}"`,
            'Content-Type: image/png',
            '',
            fileContent,
            `--${boundary}--`
        ];

        // We need to concat buffers carefully
        // Simplified approach: Construct header string, then file buffer, then footer

        const header = bodyParts.slice(0, -3).join('\r\n') + '\r\n'; // Up to file header
        const footer = '\r\n' + bodyParts[bodyParts.length - 1];

        // Actually, mixing strings and buffers in array for request body construction is cleaner
        // But http.request.write takes string or buffer.

        // Let's refine the body construction
        const preFile = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="restaurantName"',
            '',
            'E2E Test Restaurant',
            `--${boundary}`,
            'Content-Disposition: form-data; name="city"',
            '',
            'Test City',
            `--${boundary}`,
            'Content-Disposition: form-data; name="country"',
            '',
            'Test Country',
            `--${boundary}`,
            'Content-Disposition: form-data; name="deliveryTime"',
            '',
            '30',
            `--${boundary}`,
            'Content-Disposition: form-data; name="cuisines"',
            '',
            '["TestCuisine"]',
            `--${boundary}`,
            `Content-Disposition: form-data; name="imageFile"; filename="${filename}"`,
            'Content-Type: image/png',
            '',
            ''
        ].join('\r\n');

        const postFile = '\r\n' + `--${boundary}--`;

        const bodyBuffer = Buffer.concat([
            Buffer.from(preFile, 'utf-8'),
            fileContent,
            Buffer.from(postFile, 'utf-8')
        ]);

        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/api/v1/restaurant/',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': bodyBuffer.length,
                'Cookie': `token=${token}`
            }
        };

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log('RESPONSE:', data);
                if (res.statusCode === 201) {
                    console.log("✅ SUCCESS: Restaurant created via HTTP!");
                } else {
                    console.log("❌ FAILED");
                }
                process.exit(0);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            process.exit(1);
        });

        req.write(bodyBuffer);
        req.end();

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
