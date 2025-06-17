import cron from 'node-cron';
import { AuthModel } from '../features/auth/auth.schema.js';

const pricingPlanLimits = {
    "9k": 9000,
    "10k": 10000,
    "100k": 100000,
    "200k": 200000,
    "500k": 500000,
    "1M": 1000000,
    "2M": 2000000,
    "5M": 5000000,
    "10M": 10000000,
    "unlimited": Infinity
};

const getLimitForPlan = (plan) => pricingPlanLimits[plan] || 0;

export const checkSubscriptions = async () => {
    try {
        const users = await AuthModel.find({});
        const currentDate = new Date();

        for (const user of users) {
            const plan = pricingPlans.find(p => p.plan === user.pricingPlan);
            if (!plan) continue;

            // Check if user has exceeded event limit
            if (plan.events !== Infinity && user.eventsUsed >= plan.events) {
                user.paymentStatus = "expired";
                await user.save();
            }

            // Check if subscription has expired
            if (currentDate > user.subscriptionEndDate) {
                user.paymentStatus = "expired";
                await user.save();
            }

            // Reset usage if subscription is active and days have passed
            if (user.paymentStatus === "active") {
                const daysPassed = Math.floor((currentDate - user.lastUsageReset) / (1000 * 60 * 60 * 24));
                if (daysPassed >= 30) {
                    user.eventsUsed = 0;
                    user.lastUsageReset = currentDate;
                    await user.save();
                }
            }
        }
    } catch (error) {
        console.error("Error in subscription check:", error);
    }
};

// Runs every day at midnight
cron.schedule("0 0 * * *", checkSubscriptions);
