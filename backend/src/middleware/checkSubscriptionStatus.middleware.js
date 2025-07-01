import { AuthModel } from "../features/auth/auth.schema.js";
import pricingPlans from "../../pricingPlans.js";

export const checkSubscriptionStatus = async (req, res, next) => {
    try {
        const user = await AuthModel.findById(req.userID);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const currentDate = new Date();
        const plan = pricingPlans.find(p => p.plan === user.pricingPlan);

        // Check if subscription has expired
        const isTrialValid = user.paymentStatus === "trial" && currentDate <= new Date(user.subscriptionEndDate);
        const isPaidValid = user.paymentStatus === "active" && currentDate <= new Date(user.subscriptionEndDate);

        if (!isTrialValid && !isPaidValid) {
            return res.status(403).json({ 
                message: "Your subscription has expired. Please renew to continue accessing analytics.",
                subscriptionExpired: true
            });
        }

        // Check event limits for analytics endpoints
        if (plan && plan.events !== Infinity && user.eventsUsed >= plan.events) {
            return res.status(403).json({ 
                message: "Event limit reached. Please upgrade your plan to continue accessing analytics.",
                limitExceeded: true,
                currentPlan: user.pricingPlan,
                eventsUsed: user.eventsUsed,
                eventLimit: plan.events
            });
        }

        next();
    } catch (err) {
        console.error("Subscription check error:", err);
        res.status(500).json({ message: "Server error while checking subscription." });
    }
};
