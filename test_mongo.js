require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("MONGODB_URI is missing in .env");
    process.exit(1);
}

console.log("Connecting to MongoDB...");

mongoose.connect(uri)
    .then(async () => {
        console.log("✅ Connected to MongoDB successfully!");

        try {
            console.log(`Connected to database: ${mongoose.connection.name}`);
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log("Collections:");
            collections.forEach(c => console.log(` - ${c.name}`));
        } catch (e) {
            console.error("Error listing databases:", e.message);
        }

        await mongoose.disconnect();
        console.log("Disconnected.");
    })
    .catch((err) => {
        console.error("❌ Connection failed:", err.message);
        if (err.message.includes("bad auth")) {
            console.log("Suggestion: Check your username and password in the URI.");
        } else if (err.cause && err.cause.code === "ENOTFOUND") {
            console.log("Suggestion: Check if your IP is whitelisted in MongoDB Atlas.");
        }
    });
