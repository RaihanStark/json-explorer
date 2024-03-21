import mongoose from "mongoose";

export async function connectToDatabase() {
  // TODO: Implement Cache
  try {
    await mongoose.connect("mongodb://localhost:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export async function connectToWorkCollection() {
  return mongoose.connection.collection(process.env.MONGO_WORK_COLLECTION);
}

export async function connectToConfigCollection() {
  return mongoose.connection.collection(process.env.MONGO_CONFIG_COLLECTION);
}
