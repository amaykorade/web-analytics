import express from "express";
import { createOrder, getPayments, verifyPayment } from "./payment.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";


const PaymentRouter = express.Router();

// Route to create an order (Frontend calls this before payment)
PaymentRouter.post("/create-order", createOrder);

// Route to verify payment (Called after successful payment)
PaymentRouter.post("/verify-payment", verifyPayment);

// Route to fetch all payments for a user
PaymentRouter.get("/user-payments", jwtAuth, getPayments);

export default PaymentRouter;

