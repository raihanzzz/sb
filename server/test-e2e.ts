import http from "http";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "./models/user.model";

dotenv.config();

// Connect DB to get a user
const prepare = async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    const user = await User.findOne({});
    if (!user) throw new Error("No user found");
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, { expiresIn: "1h" });
    return token;
};

const run = async () => {
    try {
        const token = await prepare();
        console.log("Token generated.");

        const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
        const bodyStart = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="restaurantName"',
            '',
            'Test Restaurant E2E',
            `--${boundary}`,
            'Content-Disposition: form-data; name="city"',
            '',
            'New York',
            `--${boundary}`,
            'Content-Disposition: form-data; name="country"',
            '',
            'USA',
            `--${boundary}`,
            'Content-Disposition: form-data; name="deliveryTime"',
            '',
            '45',
            `--${boundary}`,
            'Content-Disposition: form-data; name="cuisines"',
            '',
            '["Italian", "Mexican"]',
            `--${boundary}`,
            'Content-Disposition: form-data; name="imageFile"; filename="test.txt"',
            'Content-Type: text/plain',
            '',
            'dummy image content for logic check (will fail cloud upload if strict image check, but controller logs should show)',
            `--${boundary}--`
        ].join('\r\n');

        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/api/v1/restaurant/',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(bodyStart),
                'Cookie': `token=${token}`
            }
        };

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log('RESPONSE:', data);
                process.exit(0);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            process.exit(1);
        });

        req.write(bodyStart);
        req.end();

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
