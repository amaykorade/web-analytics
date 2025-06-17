import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthModel } from "./auth.schema.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from "crypto";
import Razorpay from "razorpay";

dotenv.config();




const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false,
    }
})

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await AuthModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new AuthModel({
            email,
            password: hashedPassword,
            name,
            pricingPlan: "free",
            paymentStatus: "active",
            subscriptionStartDate: new Date(),
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await AuthModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                pricingPlan: user.pricingPlan,
                paymentStatus: user.paymentStatus
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
};

export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await AuthModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                pricingPlan: user.pricingPlan,
                paymentStatus: user.paymentStatus
            }
        });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export const getUser = async (req, res) => {
    const userID = req.userID;
    try {
        const user = await AuthModel.findById(userID);
        if (user) {
            return res.status(200).json({ user, userID });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// export const getToken = (req, res) => {
//     if (req.session) {
//         console.log("Session data:", req.session);
//         if (req.session.token) {
//             return res.status(200).json({ token: req.session.token });
//         }
//     }
//     console.error("Session or token missing.");
//     return res.status(401).json({ message: "Token not found in session" });
// };

const findByEmail = async (email) => {
    try {
        const user = await AuthModel.findOne({ email }).exec();
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const verificationStatus = async (req, res) => {
    try {
        const { email } = req.query;;
        console.log("verify", req.body);

        if (!email) {
            return res.status(400).json({ message: "Email is required", isVerified: false });
        }

        const user = await AuthModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not found", isVerified: false })
        }

        console.log("user", user)

        if (user.verified == true) {
            return res.status(200).json({ message: "User verified successfully", isVerified: true });
        } else {
            return res.status(200).json({ message: "User is not verified", isVerified: false });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid email" });
    }
}

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz");
        console.log("decoded", decoded);

        const user = await findByEmail(decoded.email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        console.log(user);

        if (user.verified == true) {
            return res.status(400).json({ message: "User is already verified", isVerified: user.verified });
        }

        user.verified = true;
        await user.save();

        const loginToken = jwt.sign({ userID: user._id, email: user.email }, "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz", {
            expiresIn: "30d",
        });

        return res.status(200).json({ message: "Email verified successfully!", token: loginToken, isVerified: user.verified });

    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
}



