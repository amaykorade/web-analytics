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

const checkAndUpdateSubscriptions = async () => {
    try {
        console.log(`[CRON] Subscription check started at ${new Date().toISOString()}`);
        const users = await AuthModel.find({ paymentStatus: "active" });

        for (const user of users) {
            const eventLimit = getLimitForPlan(user.pricingPlan);

            // 1. Expire if over limit (excluding unlimited)
            if (user.eventsUsed > eventLimit && eventLimit !== Infinity) {
                user.paymentStatus = "expired";
                console.log(`[EXPIRE] ${user.email} exceeded ${eventLimit} events. Marked as expired.`);
            }

            // 2. Reset usage if it's a yearly plan and 30 days have passed
            if (user.isYearly && user.subscriptionStartDate) {
                const now = new Date();
                const daysPassed = Math.floor(
                    (now - new Date(user.subscriptionStartDate)) / (1000 * 60 * 60 * 24)
                );

                if (daysPassed >= 30 && user.eventsUsed > 0) {
                    user.eventsUsed = 0;
                    user.subscriptionStartDate = now;
                    console.log(`[RESET] ${user.email}'s usage reset after ${daysPassed} days.`);
                }
            }

            await user.save();
        }

        console.log(`[CRON] Subscription check completed at ${new Date().toISOString()}`);
    } catch (error) {
        console.error("[CRON ERROR] Subscription update failed:", error);
    }
};

// Runs every day at midnight
cron.schedule("0 0 * * *", checkAndUpdateSubscriptions);
