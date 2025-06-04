import { AuthModel } from "../features/auth/auth.schema.js";

export const checkSubscriptionStatus = async (req, res, next) => {
    try {
        const user = await AuthModel.findById(req.userID);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const currentDate = new Date();

        const isTrialValid = user.paymentStatus === "trial" && currentDate <= new Date(user.subscriptionEndDate);
        const isPaidValid = user.paymentStatus === "active" && currentDate <= new Date(user.subscriptionEndDate);

        if (!isTrialValid && !isPaidValid) {
            return res.status(403).json({ message: "Your subscription has expired." });
        }

        next();
    } catch (err) {
        console.error("Subscription check error:", err);
        res.status(500).json({ message: "Server error while checking subscription." });
    }
};
