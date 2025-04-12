import { AuthModel } from "../features/auth/auth.schema.js";

export const checkSubscriptionStatus = async (req, res, next) => {
    try {
        const user = await AuthModel.findById(req.userID);

        if (!user || user.paymentStatus === "expired") {
            return res.status(403).json({ message: "Your subscription has expired." });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
