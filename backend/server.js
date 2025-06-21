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
import ScriptModel from './src/features/script/script.schema.js';

// cron job
import './src/cron-job/subscription.cron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

const STATIC_ALLOWED_ORIGINS = [
  'https://www.webmeter.in',
  'https://webmeter.in',
  'https://backend.webmeter.in',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];

// Allow CORS for static tracker scripts
app.use('/js', async (req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) {
        return next();
    }
    
    try {
        const scripts = await ScriptModel.find({}, 'url');
        const dynamicOrigins = scripts.map(r => {
            try {
                return new URL(r.url).origin;
            } catch {
                return null;
            }
        }).filter(Boolean);

        const allowedOrigins = [...STATIC_ALLOWED_ORIGINS, ...dynamicOrigins];
        
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        next();
    } catch (err) {
        console.error("Error in /js CORS middleware:", err);
        next(err);
    }
});

app.use(express.static(path.join(__dirname, 'public')));

// 🌍 **CORS Middleware**
app.use(cors({
    origin: async function (origin, callback) {
        try {
            if (!origin) return callback(null, true); // allow non-browser requests

            // Query the DB for user-registered origins
            const scripts = await ScriptModel.find({}, 'url');
            const dynamicOrigins = scripts.map(r => {
                try {
                    return new URL(r.url).origin;
                } catch {
                    return null;
                }
            }).filter(Boolean);

            // Combine static and dynamic origins
            const allowedOrigins = [...STATIC_ALLOWED_ORIGINS, ...dynamicOrigins];

            console.log("🔍 CORS Check -> Request Origin:", origin);
            console.log("✅ Allowed Origins List:", allowedOrigins);

            if (allowedOrigins.includes(origin)) {
                console.log("✔️ Allowed:", origin);
                callback(null, true);
            } else {
                console.error(`❌ CORS Error: ${origin} is not allowed.`);
                callback(new Error("Not allowed by CORS"));
            }
        } catch (err) {
            callback(err);
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

        await getAllURL(); // Fetch domains before starting server

        app.listen(PORT, '0.0.0.0', async () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting the server:", error);
    }
})();
