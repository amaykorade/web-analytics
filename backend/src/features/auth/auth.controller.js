import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthModel } from "./auth.schema.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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
    const { name, email, password } = req.body;
    try {
        const existingUser = await findByEmail(email);
        if (existingUser) {
            if (existingUser.verified == true) {
                return res.status(400).json({ message: "User already exists and is verified.", isVerified: existingUser.verified });
            } else {
                await AuthModel.deleteOne({ email });
            }
        }


        const hashedPassword = await bcrypt.hash(password, 12);

        const verificationToken = jwt.sign({ name, email }, process.env.JWT_SECRET, { expiresIn: "30d" });

        const newUser = new AuthModel({
            name,
            email,
            password: hashedPassword,
            verified: false,
        });
        await newUser.save();

        const verificationLink = `https://backend.webmeter.in/api/user/verify?token=${verificationToken}`;

        const mailOptions = {
            from: "contact@webmeter.in",
            to: email,
            subject: "Verify Your Email",
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: "Verification email sent. Please check your inbox.", isVerified: false, token: verificationToken });

    } catch (error) {
        console.error("Error sending email:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error sending email" });
        }
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const user = await findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            // 3. Create token.
            const token = jwt.sign(
                {
                    userID: user._id,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '30d',
                }
            );



            return res.status(200).send({ token });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Something went wrong" });
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