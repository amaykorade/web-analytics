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
import ScriptModel from './src/features/script/script.schema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

app.use(express.static(path.join(__dirname, 'public')));


// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    // 'http://localhost:5500',
    // 'http://127.0.0.1:5500',
    // 'http://localhost',
    // 'http://127.0.0.1',
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow localhost:5500 and 127.0.0.1:5500 (and other variations)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies to be sent
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
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
// app.use(bodyParser.json()); // Parse JSON payloads
app.use(express.json());


// Rate limit configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowsMs
    message: {
        message: "Too many requests, please try again later."
    },
})


// Apply rate limiting only to specific routes (tracking-related API)
app.use('/api/tracking', limiter);

// Trust proxy to handle forwarded IPs (useful in production environments)
app.set('trust proxy', true);

// New endpoint for validation
app.post('/api/track/validate', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: "URL not provided." });
    }
    // Log validation success
    console.log(`Validation check from: ${url}`);
    res.status(200).json({ success: true, message: "Script validation successful." });
});

// Routes
app.use('/api/user', AuthRouter) // Authentication routes
app.use('/api/data', TrackingRouter); // Tracking routes
app.use('/api/script', ScriptRouter); // Script routes



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    connectUsingMongoose();
})
