import express from 'express';
import { addData, eventsByTypes, eventsDaily, getAnalysis, getReferralStats, heatmapData, sessionTrends, totalEvents, userRetention } from './tracking.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

const TrackingRouter = express.Router();



TrackingRouter.get("/", (req, res) => {
    res.json({ message: 'Hello from API, Amay Korade' });
});

TrackingRouter.post("/track", addData);

TrackingRouter.get("/analytics/total-data", jwtAuth, getAnalysis);

// TrackingRouter.get("/analytics/device-data", jwtAuth, getUserDeviceData);


TrackingRouter.get("/analytics/referrals", jwtAuth, getReferralStats);

TrackingRouter.get("/analytics/total-events", jwtAuth, totalEvents);

TrackingRouter.get("/analytics/events-by-type", jwtAuth, eventsByTypes);

TrackingRouter.get("/analytics/events-daily", jwtAuth, eventsDaily);

TrackingRouter.get("/analytics/user-retention", jwtAuth, userRetention);

TrackingRouter.get("/analytics/heatmap-data", jwtAuth, heatmapData);

TrackingRouter.get("/analytics/session-trends", jwtAuth, sessionTrends);

export default TrackingRouter;