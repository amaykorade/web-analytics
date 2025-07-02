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

const findByEmail = async (email) => {
    try {
        const user = await AuthModel.findOne({ email }).exec();
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `https://www.webmeter.in/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verify your email address",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to WebMeter!</h2>
                <p>Hi ${name},</p>
                <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>Best regards,<br>The WebMeter Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

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
            verified: false,
            pricingPlan: "9k",
            paymentStatus: "trial",
            subscriptionStartDate: new Date(),
            subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        });

        await user.save();

        // Generate verification token
        const verificationToken = jwt.sign(
            { email: user.email },
            "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz",
            { expiresIn: "24h" }
        );

        // Send verification email
        await sendVerificationEmail(email, name, verificationToken);

        // Generate temporary token for frontend
        const tempToken = jwt.sign(
            { userID: user._id, email: user.email },
            "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz",
            { expiresIn: "1h" }
        );

        res.status(201).json({ 
            message: "User registered successfully. Please check your email for verification.",
            token: tempToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                verified: user.verified
            }
        });
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

        // Check if user is verified
        if (!user.verified) {
            return res.status(401).json({ 
                message: "Please verify your email address before logging in. Check your inbox for the verification email." 
            });
        }

        const token = jwt.sign(
            { userID: user._id, email: user.email },
            "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz",
            { expiresIn: '30d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                verified: user.verified,
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
        const user = await AuthModel.findById(decoded.userID);

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

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await AuthModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        // Generate new verification token
        const verificationToken = jwt.sign(
            { email: user.email },
            "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz",
            { expiresIn: "24h" }
        );

        // Send verification email
        await sendVerificationEmail(email, user.name, verificationToken);

        res.status(200).json({ 
            message: "Verification email sent successfully. Please check your inbox." 
        });
    } catch (error) {
        console.error("Error resending verification email:", error);
        res.status(500).json({ message: "Error sending verification email" });
    }
};

// Get user usage status
export const getUserUsage = async (req, res) => {
    try {
        const user = await AuthModel.findById(req.userID);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const plan = pricingPlans.find(p => p.plan === user.pricingPlan);
        const usagePercentage = plan && plan.events !== Infinity 
            ? Math.round((user.eventsUsed / plan.events) * 100) 
            : 0;

        res.status(200).json({
            success: true,
            usage: {
                eventsUsed: user.eventsUsed,
                eventLimit: plan ? plan.events : 0,
                usagePercentage,
                isUnlimited: plan ? plan.events === Infinity : false,
                currentPlan: user.pricingPlan,
                paymentStatus: user.paymentStatus,
                subscriptionEndDate: user.subscriptionEndDate,
                lastUsageReset: user.lastUsageReset
            }
        });
    } catch (error) {
        console.error("Error getting user usage:", error);
        res.status(500).json({ message: "Error getting usage information." });
    }
};



