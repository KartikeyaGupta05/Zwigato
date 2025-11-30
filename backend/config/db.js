import mongoose from "mongoose";

function connectDb() {
  mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.log("❌ MongoDB connection error:", err));
}

export default connectDb;
