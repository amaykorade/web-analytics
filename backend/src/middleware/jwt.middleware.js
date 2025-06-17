import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.userId;
        next();
    } catch (err) {
        console.error("Error verifying token:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default verifyToken;