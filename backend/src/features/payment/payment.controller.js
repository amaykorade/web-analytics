import dotenv from "dotenv";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Razorpay from "razorpay";
import { createHmac } from "crypto";


import { AuthModel } from "../auth/auth.schema.js";
import { PaymentModel } from "./payment.schema.js";

dotenv.config();

// PayPal API base URL

// const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com"
// const PAYPAL_API_URL = "https://api.paypal.com";


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




// Fetch PayPal access token
// const getPayPalAccessToken = async () => {
//     const base64Credentials = Buffer.from(
//         `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
//     ).toString("base64");

//     const response = await axios.post(
//         `${PAYPAL_API_URL}/v1/oauth2/token`,
//         "grant_type=client_credentials",
//         {
//             headers: {
//                 Authorization: `Basic ${base64Credentials}`,
//                 "Content-Type": "application/x-www-form-urlencoded",
//             },
//         }
//     );

//     return response.data.access_token;
// };

// // Create PayPal Order Controller
// export const createOrder = async (req, res) => {
//     try {
//         const { email, currentPlan, isYearly } = req.body;

//         if (!email || !currentPlan?.price) {
//             return res.status(400).json({ message: "Invalid request body" });
//         }

//         const user = await AuthModel.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const amount = currentPlan.price;
//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: "Invalid amount" });
//         }

//         const order_id = uuidv4();
//         const accessToken = await getPayPalAccessToken();

//         const orderResponse = await axios.post(
//             `${PAYPAL_API_URL}/v2/checkout/orders`,
//             {
//                 intent: "CAPTURE",
//                 purchase_units: [
//                     {
//                         reference_id: order_id,
//                         amount: {
//                             currency_code: "USD",
//                             value: amount,
//                         },
//                         // payee: {
//                         //     email_address: process.env.PAYPAL_BUSINESS_EMAIL,
//                         // },
//                     },
//                 ],
//                 application_context: {
//                     return_url: process.env.PAYPAL_RETURN_URL,
//                     cancel_url: process.env.PAYPAL_CANCEL_URL,
//                 },
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         const paypalOrderId = orderResponse.data.id;
//         const approvalUrl = orderResponse.data.links.find(
//             (link) => link.rel === "approve"
//         )?.href;

//         if (!paypalOrderId || !approvalUrl) {
//             console.error("PayPal response missing approval URL or order ID");
//             return res.status(500).json({
//                 message: "Approval URL not found in PayPal response",
//                 paypal_response: orderResponse.data,
//             });
//         }

//         const newPayment = new PaymentModel({
//             userId: user._id,
//             orderId: paypalOrderId,
//             amount,
//             currency: "USD",
//             status: "created",
//         });

//         await newPayment.save();

//         res.status(201).json({
//             orderId: order_id,
//             paypal_order_id: paypalOrderId,
//             approval_url: approvalUrl,
//         });
//     } catch (error) {
//         console.error("Error creating PayPal order:", error?.response?.data || error);
//         res.status(500).json({
//             message: "Error creating PayPal order",
//             error: error?.response?.data || error.message,
//         });
//     }
// };

// export const verifyPayment = async (req, res) => {
//     try {
//         const { orderId, paypalOrderId, payerId, email, currentPlan, isYearly } = req.body;

//         const accessToken = await getPayPalAccessToken();

//         const paymentVerification = await axios.post(
//             `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
//             {},
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         console.log("✅ Payment capture response:", JSON.stringify(paymentVerification.data, null, 2));


//         const paymentStatus = paymentVerification.data.status;
//         if (paymentStatus !== "COMPLETED") {
//             return res
//                 .status(400)
//                 .json({ message: "Payment not completed yet" });
//         }

//         const user = await AuthModel.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const startDate = new Date();
//         const endDate = isYearly
//             ? new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000)
//             : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

//         user.paymentStatus = "active";
//         user.subscriptionId = orderId;
//         user.pricingPlan = currentPlan.plan || user.pricingPlan;
//         user.subscriptionStartDate = startDate;
//         user.subscriptionEndDate = endDate;
//         user.isYearly = isYearly;

//         await user.save();

//         await PaymentModel.findOneAndUpdate(
//             { orderId: paypalOrderId },
//             {
//                 paymentId: paymentVerification.data.id,
//                 status: "paid",
//                 pricingPlan: currentPlan.plan,
//             },
//             { new: true }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Payment verified",
//             user,
//         });
//     } catch (error) {
//         console.error("Error verifying PayPal payment:", error?.response?.data || error);
//         res.status(500).json({ message: "Error verifying PayPal payment" });
//     }
// };

// export const getPayments = async (req, res) => {
//     try {
//         const userId = req.userID;
//         if (!userId) {
//             return res.status(400).json({ message: "User ID is required" });
//         }

//         const user = await AuthModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const payments = await PaymentModel.find({ userId: user._id });
//         return res.status(200).json({ payments, user });
//     } catch (error) {
//         console.error("Error fetching payments:", error);
//         res.status(500).json({ message: "Error fetching payments" });
//     }
// };
