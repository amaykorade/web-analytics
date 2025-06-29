import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geoip from 'geoip-lite';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import http from 'http';

import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import { SERVER_CONFIG, RATE_LIMIT_CONFIG, SESSION_CONFIG } from './src/config/constants.js';
import TrackingRouter from './src/features/tracking/tracking.routes.js';
import AuthRouter from './src/features/auth/auth.routes.js';
import ScriptRouter from './src/features/script/script.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllURL } from './src/features/script/script.controller.js';
import passport from "passport";
import session from "express-session";
import PaymentRouter from './src/features/payment/payment.routes.js';
import FunnelRouter from './src/features/funnel/funnel.routes.js';
import { migrateVerificationStatus } from './src/features/script/script.migration.js';
import { corsMiddleware, trackerCorsMiddleware } from './src/middleware/cors.middleware.js';
import webSocketService from './src/services/websocket.service.js';

// cron job
import './src/cron-job/subscription.cron.js';

dotenv.config();

const app = express();
const PORT = SERVER_CONFIG.PORT;

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

// Allow CORS for static tracker scripts
app.use('/js', trackerCorsMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

// 🌍 **CORS Middleware**
app.use(cors({
    origin: corsMiddleware,
    credentials: true,
}));

app.options("*", cors());

// 🛡 **Security & Performance Middleware**
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(session(SESSION_CONFIG));
app.use(passport.initialize());
app.use(passport.session());

// ⏳ **Rate Limiting**
const limiter = rateLimit({
    windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
    max: RATE_LIMIT_CONFIG.MAX_REQUESTS,
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

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket service
webSocketService.initialize(server);

// Export io for use in controllers
export const io = webSocketService.getIO();

// 🚀 **Start Server After Connecting to DB**
(async () => {
    try {
        await connectUsingMongoose();
        console.log("✅ Database connected successfully!");

        // Run migration for verification status
        await migrateVerificationStatus();
        console.log("✅ Verification status migration completed!");

        await getAllURL(); // Fetch domains before starting server

        server.listen(PORT, SERVER_CONFIG.HOST, async () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting the server:", error);
    }
})();
