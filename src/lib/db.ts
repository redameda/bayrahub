import mongoose from "mongoose";

const ConnectDb = async () => {
    try {
        console.log("MONGO_URL inside ConnectDb:", process.env.MONGO_URL);
        const uri = process.env.MONGO_URL as string;

        if (!uri) {
            throw new Error("❌ MONGO_URL not set in environment variables");
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log("✅ Connected successfully!");
        } else {
            console.log("Already connected");
        }
    } catch (err) {
        console.error("❌ Connection failed:", err);
        throw err;
    }
};
export default ConnectDb