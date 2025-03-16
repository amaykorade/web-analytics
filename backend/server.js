import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geoip from 'geoip-lite';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import TrackingRouter from './src/features/tracking/tracking.routes.js';
import AuthRouter from './src/features/auth/auth.routes.js';
import ScriptRouter from './src/features/script/script.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllURL } from './src/features/script/script.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

app.use(express.static(path.join(__dirname, 'public')));

let allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3001',
    'https://www.webmeter.in',
    'https://backend.webmeter.in'
];

// ⏳ **Update Allowed Origins (Ensures DB Connection)**
const updateAllowedOrigins = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("⚠️ Waiting for database connection...");
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retrying
        }

        const result = await getAllURL();
        if (Array.isArray(result)) {
            allowedOrigins = [...new Set([...allowedOrigins, ...result])]; // Avoid duplicates
            console.log("✅ Updated Allowed Origins:", allowedOrigins);
        }
    } catch (error) {
        console.error("❌ Error fetching allowed origins:", error);
    }
};

// 🌍 **CORS Middleware**
app.use(async (req, res, next) => {
    if (!allowedOrigins.length || allowedOrigins.length === 1) {
        await updateAllowedOrigins(); // Ensure latest origins are set
    }
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Error: ${origin} is not allowed.`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.options("*", cors());

// 🛡 **Security & Performance Middleware**
app.use(helmet());
app.use(compression());
app.use(express.json());

// ⏳ **Rate Limiting**
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again later." },
});
app.use('/api/tracking', limiter);

// 🚀 **Trust Proxy for Forwarded IPs**
app.set('trust proxy', true);

// ✅ **Validation Endpoint**
app.post('/api/track/validate', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: "URL not provided." });
    }
    console.log(`Validation check from: ${url}`);
    res.status(200).json({ success: true, message: "Script validation successful." });
});

// 🔄 **Routes**
app.use('/api/user', AuthRouter);
app.use('/api/data', TrackingRouter);
app.use('/api/script', ScriptRouter);

// 🚀 **Start Server After Connecting to DB**
(async () => {
    try {
        await connectUsingMongoose();
        console.log("✅ Database connected successfully!");

        await updateAllowedOrigins(); // Fetch domains before starting server

        app.listen(PORT, '0.0.0.0', async () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting the server:", error);
    }
})();
