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
import passport from "passport";
import session from "express-session";
import PaymentRouter from './src/features/payment/payment.routes.js';
// import funnelRoutes from './features/funnel/funnel.routes.js';
import FunnelRouter from './src/features/funnel/funnel.routes.js';
import { migrateVerificationStatus } from './src/features/script/script.migration.js';

// cron job
import './src/cron-job/subscription.cron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

// Set CORS headers manually for static files
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin || "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    next();
});


app.use(express.static(path.join(__dirname, 'public')));

let allowedOrigins = [
    'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3000',
    'https://www.webmeter.in',
    'https://webmeter.in',
    'https://backend.webmeter.in',
    'http://127.0.0.1:5500',
    'http://localhost:5500'
];

// ⏳ **Update Allowed Origins (Ensures DB Connection)**
const updateAllowedOrigins = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("⚠️ Waiting for database connection...");
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retrying
        }

        const result = await getAllURL();
        console.log("🔍 Raw result from getAllURL():", result); // Debugging line

        if (Array.isArray(result)) {
            allowedOrigins = [...new Set([...allowedOrigins, ...result])]; // Avoid duplicates
            console.log("✅ Updated Allowed Origins:", allowedOrigins);
        } else {
            console.error("❌ Error: getAllURL() did not return an array.");
        }
    } catch (error) {
        console.error("❌ Error fetching allowed origins:", error);
    }
};


// 🌍 **CORS Middleware**
await updateAllowedOrigins();

app.use(cors({
    origin: function (origin, callback) {
        console.log("🔍 CORS Check -> Request Origin:", origin);
        console.log("✅ Allowed Origins List:", allowedOrigins);

        if (!origin || allowedOrigins.includes(origin)) {
            console.log("✔️ Allowed:", origin);
            callback(null, true);
        } else {
            console.error(`❌ CORS Error: ${origin} is not allowed.`);
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
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api/payment', PaymentRouter);
app.use('/api/funnel', FunnelRouter);

// 🚀 **Start Server After Connecting to DB**
(async () => {
    try {
        await connectUsingMongoose();
        console.log("✅ Database connected successfully!");

        // Run migration for verification status
        await migrateVerificationStatus();
        console.log("✅ Verification status migration completed!");

        await updateAllowedOrigins(); // Fetch domains before starting server

        app.listen(PORT, '0.0.0.0', async () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting the server:", error);
    }
})();
