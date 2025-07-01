import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    verified: { type: Boolean, default: false },

    // Trial & Payment Tracking
    subscriptionStartDate: { type: Date, default: Date.now },
    subscriptionEndDate: {
        type: Date,
        default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    isYearly: { type: Boolean },
    paymentStatus: { type: String, enum: ["trial", "active", "expired"], default: "trial" },
    subscriptionId: { type: String },
    eventsUsed: { type: Number, default: 0 },
    lastUsageReset: { type: Date, default: Date.now },
    pricingPlan: { type: String, enum: ["9k", "10k", "100k", "200k", "500k", "1M", "2M", "5M", "10M", "10M+"], default: "9k" },
});



export const AuthModel = mongoose.model("User", authSchema);