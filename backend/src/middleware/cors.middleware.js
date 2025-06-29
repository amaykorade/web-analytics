import ScriptModel from '../features/script/script.schema.js';
import { CORS_CONFIG } from '../config/constants.js';

// Cache for allowed origins
let cachedAllowedOrigins = null;
let lastCacheTime = 0;

async function getAllowedOrigins() {
  const now = Date.now();
  if (cachedAllowedOrigins && now - lastCacheTime < CORS_CONFIG.CACHE_DURATION) {
    return cachedAllowedOrigins;
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
    
    cachedAllowedOrigins = [...CORS_CONFIG.STATIC_ALLOWED_ORIGINS, ...dynamicOrigins];
    lastCacheTime = now;
    return cachedAllowedOrigins;
  } catch (error) {
    console.error('Error fetching allowed origins:', error);
    return CORS_CONFIG.STATIC_ALLOWED_ORIGINS;
  }
}

// CORS middleware for static tracker scripts
export const trackerCorsMiddleware = async (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) {
    return next();
  }
  
  try {
    const allowedOrigins = await getAllowedOrigins();
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    next();
  } catch (err) {
    console.error("Error in tracker CORS middleware:", err);
    next(err);
  }
};

// Main CORS middleware for API routes
export const corsMiddleware = async (origin, callback) => {
  try {
    const allowedOrigins = await getAllowedOrigins();
    
    console.log("🔍 CORS Check -> Request Origin:", origin);
    console.log("✅ Allowed Origins List:", allowedOrigins);

    if (!origin || allowedOrigins.includes(origin)) {
      console.log("✔️ Allowed:", origin);
      callback(null, true);
    } else {
      console.error(`❌ CORS Error: ${origin} is not allowed.`);
      callback(new Error("Not allowed by CORS"));
    }
  } catch (err) {
    console.error("CORS middleware error:", err);
    callback(err);
  }
};

// WebSocket CORS middleware
export const webSocketCorsMiddleware = async (origin, callback) => {
  try {
    const allowedOrigins = await getAllowedOrigins();
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  } catch (err) {
    console.error("WebSocket CORS middleware error:", err);
    callback(err);
  }
}; 