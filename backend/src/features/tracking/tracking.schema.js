import mongoose from "mongoose";
import { AuthModel } from "../auth/auth.schema.js";
import pricingPlan from "../../../pricingPlans.js"


const TrackingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    visitorId: { type: String, index: true },
    websiteName: { type: String },
    sessionId: { type: String, index: true },
    timestamp: { type: Date, index: true, default: Date.now, expires: '60d' },
    type: { type: String, index: true },

    // Page visit details
    url: String,
    path: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,

    // Device & Browser Info
    userAgent: String,
    language: String,
    platform: { type: String, index: true }, // OS
    browser: { type: String, index: true },
    deviceType: { type: String, index: true },

    // Location tracking
    ip: String,
    geoLocation: {
        country: String,
        region: String,
        city: String,
        latitude: Number,
        longitude: Number,
    },

    // Interaction tracking
    elementClicked: {
        tag: String,
        id: String,
        classes: String,
        text: String,
        x: Number,
        y: Number,
    },
    scrollPosition: Number,
    timeSpent: Number,

    // Visitors journey tracking
    entryPage: { type: Boolean, default: false },
    exitPage: { type: Boolean, default: false },
    conversion: { type: Boolean, default: false },
});



export const TrackingModule = mongoose.model("Tracking", TrackingSchema);