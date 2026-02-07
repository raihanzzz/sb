//mongopassword = qCKCGLksIoR0dDVI
//username=mdraihannahid_db_user

import mongoose from "mongoose"

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI!)
        console.log('mongoDB connected.');
    }
    catch (error) {
        console.error("❌ MongoDB Connection Error: ", error);
        console.log("💡 TIP: Check if your IP address is whitelisted in MongoDB Atlas (Security -> Network Access -> Add IP -> Allow access from anywhere)");
        process.exit(1); // Exit if cannot connect
    }
}

export default connectDB