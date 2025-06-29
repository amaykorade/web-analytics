import cron from 'node-cron';
import { AuthModel } from '../features/auth/auth.schema.js';
import pricingPlans from '../../pricingPlans.js';

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
    "10M+": Infinity
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
                console.log(`User ${user.email} exceeded event limit. Plan: ${user.pricingPlan}, Used: ${user.eventsUsed}, Limit: ${plan.events}`);
            }

            // Check if subscription has expired
            if (currentDate > user.subscriptionEndDate) {
                user.paymentStatus = "expired";
                await user.save();
                console.log(`User ${user.email} subscription expired on ${user.subscriptionEndDate}`);
            }

            // Reset usage if subscription is active and it's a new month
            if (user.paymentStatus === "active") {
                const lastReset = user.lastUsageReset || user.subscriptionStartDate;
                const daysPassed = Math.floor((currentDate - lastReset) / (1000 * 60 * 60 * 24));
                
                // Reset monthly (30 days) for monthly plans, yearly for yearly plans
                const resetInterval = user.isYearly ? 365 : 30;
                
                if (daysPassed >= resetInterval) {
                    user.eventsUsed = 0;
                    user.lastUsageReset = currentDate;
                    await user.save();
                    console.log(`Reset events for user ${user.email}. New reset date: ${currentDate}`);
                }
            }
        }
    } catch (error) {
        console.error("Error in subscription check:", error);
    }
};

// Runs every day at midnight
cron.schedule("0 0 * * *", checkSubscriptions);
