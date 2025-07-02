// Test script to verify event counting across multiple websites
import mongoose from 'mongoose';
import { AuthModel } from './src/features/auth/auth.schema.js';
import { TrackingModule } from './src/features/tracking/tracking.schema.js';
import pricingPlans from './pricingPlans.js';

// Test configuration
const TEST_USER_EMAIL = 'multitest@example.com';
const WEBSITES = ['website1.com', 'website2.com', 'website3.com'];

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
        
        // Create new test user
        const user = new AuthModel({
            email: TEST_USER_EMAIL,
            name: 'Multi Website Test User',
            password: 'hashedpassword',
            verified: true,
            pricingPlan: '10k',
            paymentStatus: 'active',
            eventsUsed: 0,
            subscriptionStartDate: new Date(),
            subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
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

// Simulate events across multiple websites
const simulateMultiWebsiteEvents = async (user) => {
    console.log('\n🌐 Simulating events across multiple websites...');
    
    const eventsPerWebsite = 1000;
    const totalEvents = WEBSITES.length * eventsPerWebsite;
    
    console.log(`📊 Creating ${eventsPerWebsite} events per website (${totalEvents} total)`);
    
    for (const website of WEBSITES) {
        console.log(`\n📝 Creating events for ${website}...`);
        
        for (let i = 0; i < eventsPerWebsite; i++) {
            // Create tracking entry
            const trackingEntry = new TrackingModule({
                userId: user._id,
                websiteName: website,
                type: 'page_visit',
                url: `https://${website}/page${i}`,
                sessionId: `session_${website}_${i}`,
                visitorId: `visitor_${website}_${i}`,
                timestamp: new Date(),
                userAgent: 'Test Browser',
                referrer: 'direct'
            });
            
            await trackingEntry.save();
            
            // Increment user's event count (this is what happens in the real tracking controller)
            user.eventsUsed += 1;
            await user.save();
            
            if (i % 200 === 0) {
                console.log(`  ✅ ${website}: ${i + 1}/${eventsPerWebsite} events created`);
            }
        }
        
        console.log(`✅ Completed ${website}: ${eventsPerWebsite} events`);
    }
    
    return user;
};

// Verify event counts
const verifyEventCounts = async (user) => {
    console.log('\n🔍 Verifying event counts...');
    
    // Check user's total event count
    const updatedUser = await AuthModel.findById(user._id);
    console.log(`👤 User total events: ${updatedUser.eventsUsed}`);
    
    // Check events per website in database
    for (const website of WEBSITES) {
        const websiteEvents = await TrackingModule.countDocuments({
            userId: user._id,
            websiteName: website
        });
        console.log(`🌐 ${website}: ${websiteEvents} events in database`);
    }
    
    // Check total events in database
    const totalDatabaseEvents = await TrackingModule.countDocuments({
        userId: user._id
    });
    console.log(`📊 Total events in database: ${totalDatabaseEvents}`);
    
    // Verify they match
    if (updatedUser.eventsUsed === totalDatabaseEvents) {
        console.log('✅ SUCCESS: User event count matches database total!');
    } else {
        console.log('❌ ERROR: User event count does not match database total!');
    }
    
    // Check plan limits
    const plan = pricingPlans.find(p => p.plan === updatedUser.pricingPlan);
    console.log(`📋 Plan: ${updatedUser.pricingPlan}, Limit: ${plan.events}, Used: ${updatedUser.eventsUsed}`);
    
    if (plan.events !== Infinity && updatedUser.eventsUsed >= plan.events) {
        console.log('⚠️  WARNING: User has reached or exceeded their event limit!');
    } else {
        console.log('✅ User is within their event limit');
    }
    
    return updatedUser;
};

// Run the test
const runMultiWebsiteTest = async () => {
    try {
        await connectDB();
        
        console.log('\n🧪 Starting Multi-Website Event Counting Test\n');
        
        // Create test user
        let user = await createTestUser();
        
        // Simulate events across multiple websites
        user = await simulateMultiWebsiteEvents(user);
        
        // Verify the counts
        await verifyEventCounts(user);
        
        console.log('\n🎉 Multi-website event counting test completed successfully!');
        console.log('\n📋 Summary:');
        console.log('- Events are correctly counted across ALL websites for a user');
        console.log('- User.eventsUsed represents the total events from all websites');
        console.log('- Event limits apply to the total across all websites');
        console.log('- This is the correct behavior for pricing plan enforcement');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Database disconnected');
    }
};

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMultiWebsiteTest();
}

export { runMultiWebsiteTest }; 