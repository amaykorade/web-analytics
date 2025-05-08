import dotenv from "dotenv";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Razorpay from "razorpay";
import { createHmac } from "crypto";


import { AuthModel } from "../auth/auth.schema.js";
import { PaymentModel } from "./payment.schema.js";

dotenv.config();




// razorpay
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
export const createOrder = async (req, res) => {
    try {
        const { email, currentPlan, isYearly } = req.body;
        console.log("body", req.body);

        if (!email || !currentPlan?.price) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const user = await AuthModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const amount = currentPlan.price * 100; // Razorpay accepts amount in paise

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
        };

        const order = await razorpay.orders.create(options);
        console.log("Generated Razorpay Order:", order);


        const newPayment = new PaymentModel({
            userId: user._id,
            orderId: order.id,
            amount: amount / 100,
            currency: "INR",
            status: "created",
        });

        await newPayment.save();

        res.status(201).json({
            razorpay_order_id: order.id,
            amount: amount / 100,
            currency: "INR",
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            message: "Error creating Razorpay order",
            error: error.message,
        });
    }
};

// ✅ Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, currentPlan, isYearly } = req.body;

        // Generate expected signature
        const generated_signature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");


        console.log("razorpay_signature from Razorpay:", razorpay_signature);
        console.log("generated_signature:", generated_signature);


        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const user = await AuthModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const startDate = new Date();
        const endDate = isYearly
            ? new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000)
            : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        user.paymentStatus = "active";
        user.subscriptionId = razorpay_order_id;
        user.pricingPlan = currentPlan.plan || user.pricingPlan;
        user.subscriptionStartDate = startDate;
        user.subscriptionEndDate = endDate;
        user.isYearly = isYearly;

        await user.save();

        await PaymentModel.findOneAndUpdate(
            { orderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                status: "paid",
                pricingPlan: currentPlan.plan,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Payment verified",
            user,
        });
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({ message: "Error verifying Razorpay payment" });
    }
};

// ✅ Get Payments
export const getPayments = async (req, res) => {
    try {
        const userId = req.userID;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await AuthModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const payments = await PaymentModel.find({ userId: user._id });
        return res.status(200).json({ payments, user });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: "Error fetching payments" });
    }
};




