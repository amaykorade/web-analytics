import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthModel } from "./auth.schema.js";


export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new AuthModel({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
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
                'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz',
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
            return res.status(200).json(user);
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