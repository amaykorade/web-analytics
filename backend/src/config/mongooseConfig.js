import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url, {});

        mongoose.connection.on('connected', () => {
            console.log("✅ MongoDB is connected using Mongoose");
        });

        mongoose.connection.on('error', (err) => {
            console.error("❌ MongoDB Connection Error:", err);
            process.exit(1); // Exit the process on failure
        });

        return mongoose.connection;
    } catch (err) {
        console.log("Error while connecting to db");
        console.log(err);
    }
}