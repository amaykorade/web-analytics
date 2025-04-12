import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { AuthModel } from "../auth/auth.schema.js";
import { PaymentModel } from "./payment.schema.js";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// Create Order (Frontend calls this API)
export const createOrder = async (req, res) => {
    try {
        console.log("createOrder: ", req.body);
        const { email, currentPlan, isYearly } = req.body;
        const amount = currentPlan.price;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const user = await AuthModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const options = {
            amount: amount * 100,
            currency: "USD",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        const newPayment = new PaymentModel({
            userId: user._id,
            orderId: order.id,
            amount: options.amount,
            currency: "USD",
            status: "created"
        });

        await newPayment.save();

        res.status(201).json({ order });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order" });
    }
};



// Verify Payment (After Successful Payment)
export const verifyPayment = async (req, res) => {
    try {
        console.log("verifyPayment: ", req.body);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, currentPlan, isYearly } = req.body;

        // Generate HMAC Hash for Verification
        const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        console.log("Generated Signature:", generated_signature);
        console.log("Received Signature:", razorpay_signature);


        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        const user = await AuthModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const startDate = new Date();
        const endDate = isYearly ? new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Update User Payment Status
        user.paymentStatus = "active";
        user.subscriptionId = razorpay_order_id;
        user.pricingPlan = currentPlan.plan || user.pricingPlan;
        user.subscriptionStartDate = startDate;
        user.subscriptionEndDate = endDate;
        user.isYearly = isYearly;
        await user.save();

        // Update Payment Record
        await PaymentModel.findOneAndUpdate(
            { orderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: "paid",
                pricingPlan: currentPlan.plan,
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Payment successful", user });


    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Error verifying payment" });
    }
};


// Get All Payments for User
export const getPayments = async (req, res) => {
    try {
        const userId = req.userID;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // const { email } = req.query;

        const user = await AuthModel.findOne(userId);
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

