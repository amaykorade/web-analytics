import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    pricingPlan: String,
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    createdAt: { type: Date, default: Date.now }
});

export const PaymentModel = mongoose.model("Payment", paymentSchema);
