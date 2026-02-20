import mongoose from "mongoose";

export const dbConnection = async()=>{
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Chat-Support";
    
    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            retryWrites: true
        });
        console.log("✅ Connected to database successfully!");
        console.log(`📍 Database: ${mongoose.connection.name}`);
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        
        // Try fallback to local MongoDB
        if (!mongoUri.includes("localhost")) {
            console.log("🔄 Trying fallback local MongoDB...");
            try {
                await mongoose.connect("mongodb://127.0.0.1:27017/Chat-Support", {
                    serverSelectionTimeoutMS: 5000
                });
                console.log("✅ Connected to local MongoDB");
            } catch (fallbackErr) {
                console.error("❌ Local MongoDB also failed:", fallbackErr.message);
                console.error("\n📌 TROUBLESHOOTING TIPS:");
                console.error("1. Make sure MongoDB is running: 'mongod'");
                console.error("2. If using MongoDB Atlas, check:");
                console.error("   - Cluster is active");
                console.error("   - IP is whitelisted (0.0.0.0/0 for development)");
                console.error("   - Username and password are correct");
                console.error("3. Check your internet connection");
                process.exit(1);
            }
        }
    }
}