import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geoip from 'geoip-lite';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

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
    // 'http://127.0.0.1:5500'
    // 'https://persona-website.onrender.com/',
];

// Dynamically fetch domains and update CORS
const updateAllowedOrigins = async () => {
    try {
        const result = await getAllURL();
        if (Array.isArray(result)) {
            allowedOrigins = [...new Set([...allowedOrigins, ...result])]; // Avoid duplicates
            // console.log("Updated allowedOrigins:", allowedOrigins);
        }
    } catch (error) {
        console.error("Error fetching allowed origins:", error);
    }
};

// Middleware for CORS
app.use(async (req, res, next) => {
    if (!allowedOrigins.length || allowedOrigins.length === 1) {
        await updateAllowedOrigins(); // Ensure latest origins are set
    }
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(200);
    }
    return res.sendStatus(403);
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());

// Rate limit configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again later." },
});
app.use('/api/tracking', limiter);

// Trust proxy for forwarded IPs
app.set('trust proxy', true);

// New endpoint for validation
app.post('/api/track/validate', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: "URL not provided." });
    }
    console.log(`Validation check from: ${url}`);
    res.status(200).json({ success: true, message: "Script validation successful." });
});

// Routes
app.use('/api/user', AuthRouter);
app.use('/api/data', TrackingRouter);
app.use('/api/script', ScriptRouter);

// Start server after connecting to DB
(async () => {
    try {
        await connectUsingMongoose();
        await updateAllowedOrigins(); // Fetch domains before starting server

        app.listen(PORT, async () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting the server:", error);
    }
})();
