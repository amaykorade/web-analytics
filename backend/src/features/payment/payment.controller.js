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

const getExchangeRate = async (from, to) => {
  // In a real app, you'd fetch this from an API
  return 83;
};

// ✅ Create Razorpay Order with fixed conversion rate (1 USD = 83 INR)
export const createOrder = async (req, res) => {
    try {
        const { currentPlan } = req.body;
        const userId = req.userID;

        if (!currentPlan || !currentPlan.price) {
            return res.status(400).json({ message: "Plan details are required" });
        }

        const amount = currentPlan.price; // Amount in USD

        const options = {
            amount: amount * 100, // Amount in the smallest currency unit (e.g., cents for USD)
            currency: 'USD',
            receipt: `receipt_order_${new Date().getTime()}`,
            notes: {
                plan: currentPlan.plan,
                user: userId,
            },
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order" });
    }
};


// ✅ Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, currentPlan, isYearly } = req.body;

        const generated_signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment is successful, now update the database
            const user = await AuthModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Save payment details
            const newPayment = new PaymentModel({
                userId: user._id,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                amount: currentPlan.price,
                pricingPlan: currentPlan.plan,
                status: 'paid',
            });
            await newPayment.save();

            // Update user's subscription
            user.pricingPlan = currentPlan.plan;
            user.isYearly = isYearly;
            user.paymentStatus = 'active';

            const now = new Date();
            if (isYearly) {
                user.subscriptionEndDate = new Date(now.setFullYear(now.getFullYear() + 1));
            } else {
                user.subscriptionEndDate = new Date(now.setMonth(now.getMonth() + 1));
            }

            await user.save();

            res.status(200).json({ success: true, message: "Payment verified and subscription updated successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
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




