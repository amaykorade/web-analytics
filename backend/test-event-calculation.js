// Test script to verify event calculation and pricing plan enforcement
import mongoose from 'mongoose';
import { AuthModel } from './src/features/auth/auth.schema.js';
import pricingPlans from './pricingPlans.js';

// Test configuration
const TEST_USER_EMAIL = 'test@example.com';
const TEST_WEBSITE = 'test-website.com';

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/website-analytics');
        console.log('✅ Connected to database');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

// Create test user
const createTestUser = async () => {
    try {
        // Delete existing test user
        await AuthModel.deleteOne({ email: TEST_USER_EMAIL });
        
        // Create new test user with 10k plan
        const user = new AuthModel({
            email: TEST_USER_EMAIL,
            name: 'Test User',
            password: 'hashedpassword',
            verified: true,
            pricingPlan: '10k',
            paymentStatus: 'active',
            eventsUsed: 0,
            subscriptionStartDate: new Date(),
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            lastUsageReset: new Date()
        });
        
        await user.save();
        console.log('✅ Test user created:', user.email, 'Plan:', user.pricingPlan);
        return user;
    } catch (error) {
        console.error('❌ Error creating test user:', error);
        throw error;
    }
};

// Simulate event tracking
const simulateEventTracking = async (user, eventCount) => {
    const plan = pricingPlans.find(p => p.plan === user.pricingPlan);
    console.log(`\n📊 Simulating ${eventCount} events for user ${user.email}`);
    console.log(`Current usage: ${user.eventsUsed}/${plan.events}`);
    
    for (let i = 1; i <= eventCount; i++) {
        // Check if limit exceeded
        if (plan.events !== Infinity && user.eventsUsed >= plan.events) {
            console.log(`❌ Event limit exceeded at event ${i}!`);
            console.log(`Used: ${user.eventsUsed}, Limit: ${plan.events}`);
            break;
        }
        
        // Increment event count
        user.eventsUsed += 1;
        await user.save();
        
        if (i % 1000 === 0 || i === eventCount) {
            console.log(`✅ Processed ${i} events. Current usage: ${user.eventsUsed}/${plan.events}`);
        }
    }
    
    return user;
};

// Test different scenarios
const runTests = async () => {
    try {
        await connectDB();
        
        console.log('\n🧪 Starting Event Calculation Tests\n');
        
        // Test 1: Basic event tracking
        console.log('Test 1: Basic event tracking (5000 events)');
        let user = await createTestUser();
        user = await simulateEventTracking(user, 5000);
        console.log(`✅ Test 1 completed. Final usage: ${user.eventsUsed}/10000\n`);
        
        // Test 2: Event limit enforcement
        console.log('Test 2: Event limit enforcement (6000 more events)');
        user = await simulateEventTracking(user, 6000);
        console.log(`✅ Test 2 completed. Final usage: ${user.eventsUsed}/10000\n`);
        
        // Test 3: Upgrade plan and continue
        console.log('Test 3: Upgrade to 100k plan and continue tracking');
        user.pricingPlan = '100k';
        user.eventsUsed = 0; // Reset for new plan
        await user.save();
        console.log(`✅ Upgraded to ${user.pricingPlan} plan`);
        
        user = await simulateEventTracking(user, 50000);
        console.log(`✅ Test 3 completed. Final usage: ${user.eventsUsed}/100000\n`);
        
        // Test 4: Unlimited plan
        console.log('Test 4: Unlimited plan (10M+)');
        user.pricingPlan = '10M+';
        user.eventsUsed = 0;
        await user.save();
        console.log(`✅ Upgraded to ${user.pricingPlan} plan (unlimited)`);
        
        user = await simulateEventTracking(user, 15000);
        console.log(`✅ Test 4 completed. Final usage: ${user.eventsUsed} (unlimited)\n`);
        
        // Test 5: Check cron job logic
        console.log('Test 5: Simulating cron job logic');
        const currentDate = new Date();
        const plan = pricingPlans.find(p => p.plan === user.pricingPlan);
        
        console.log(`Current plan: ${user.pricingPlan}`);
        console.log(`Events used: ${user.eventsUsed}`);
        console.log(`Plan limit: ${plan.events}`);
        console.log(`Payment status: ${user.paymentStatus}`);
        console.log(`Subscription end: ${user.subscriptionEndDate}`);
        console.log(`Last reset: ${user.lastUsageReset}`);
        
        // Simulate what cron job would do
        if (plan.events !== Infinity && user.eventsUsed >= plan.events) {
            console.log('❌ Cron job would mark subscription as expired');
        } else {
            console.log('✅ Cron job would keep subscription active');
        }
        
        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Database disconnected');
    }
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { runTests }; 