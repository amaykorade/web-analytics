import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.DB_URL;

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error("Error while connecting to db:", err);
        process.exit(1);
    }
};