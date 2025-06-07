import geoip from 'geoip-lite';
import { TrackingModule } from './tracking.schema.js';
import mongoose, { Mongoose } from 'mongoose';
import { format } from 'path';
import dayjs from 'dayjs';
import { UAParser } from 'ua-parser-js';
import pricingPlans from '../../../pricingPlans.js';
import { strict as assert } from 'assert';
import { createRequire } from 'module';
import { AuthModel } from '../auth/auth.schema.js';

const require = createRequire(import.meta.url);

const countries = require('i18n-iso-countries');
const enLocale = require('i18n-iso-countries/langs/en.json');
countries.registerLocale(enLocale);

const getCountryName = (isoCode) => countries.getName(isoCode, "en") || isoCode;

// Mapping for Indian states (you can extend this for other countries)
const regionMapping = {
    "MH": "Maharashtra",
    "DL": "Delhi",
    "KA": "Karnataka",
    "TN": "Tamil Nadu",
    "GJ": "Gujarat",
    "RJ": "Rajasthan",
    "UP": "Uttar Pradesh",
    "WB": "West Bengal",
    "MP": "Madhya Pradesh",
    "AP": "Andhra Pradesh",
    "KL": "Kerala",
    "BR": "Bihar",
    "PB": "Punjab",
    "HR": "Haryana",
    "OR": "Odisha",
    "CG": "Chhattisgarh",
    "UT": "Uttarakhand",
    "JH": "Jharkhand",
    "HP": "Himachal Pradesh",
    "AS": "Assam",
    "JK": "Jammu and Kashmir",
    "GA": "Goa",
    "TR": "Tripura",
    "MN": "Manipur",
    "ML": "Meghalaya",
    "NL": "Nagaland",
    "AR": "Arunachal Pradesh",
    "MZ": "Mizoram",
    "SK": "Sikkim",
    "AN": "Andaman and Nicobar Islands",
    "CH": "Chandigarh",
    "DN": "Dadra and Nagar Haveli and Daman and Diu",
    "LD": "Lakshadweep",
    "PY": "Puducherry",
    "TG": "Telangana"
};

export const addData = async (req, res) => {
    try {
        console.log('Received data:', req.body);
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data received in request body" });
        }

        const { sessionId, type, url, websiteName, userID, visitorId } = req.body;
        if (!type || !url || !websiteName || !userID || !visitorId) {
            return res.status(400).json({ message: "Invalid data received." });
        }

        // Validate tokens and payment status
        const user = await AuthModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const currentDate = new Date();
        const plan = pricingPlans.find(p => p.plan === user.pricingPlan);

        // Check expired subscription
        if (user.paymentStatus === "expired" || currentDate > user.subscriptionEndDate) {
            user.paymentStatus = "expired";
            await user.save();
            return res.status(403).json({ message: "Subscription expired. Upgrade required." });
        }

        if (!plan) {
            return res.status(500).json({ message: "Invalid pricing plan. Please contact support." });
        }

        // Check event limit (only block saving, not returning response)
        const eventLimitExceeded = plan.events !== Infinity && user.eventsUsed >= plan.events;
        if (eventLimitExceeded) {
            return res.status(200).json({ message: "Event limit reached. Data not saved, but plan still active." });
        }


        // Get the client's IP address
        const ip = req.headers['cf-connecting-ip'] ||  // Cloudflare
            req.headers['x-real-ip'] ||        // Nginx
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.socket?.remoteAddress ||
            req.connection?.remoteAddress ||
            '127.0.0.1';

        const normalizedIp = ip === '::1' || ip === '127.0.0.1' ? '58.84.60.25' : ip;  // Default to external IP for testing

        console.log("Extracted IP:", normalizedIp);

        const isPrivateIp = (ip) => /^127\./.test(ip) || /^10\./.test(ip) || /^192\.168\./.test(ip) || ip === "::1";


        // Get geolocation based on IP
        const geo = !isPrivateIp(normalizedIp) ? geoip.lookup(normalizedIp) : null;
        const geoLocation = geo ? {
            country: getCountryName(geo.country) || "Unknown",
            region: regionMapping[geo.region] || geo.region || "Unknown",
            city: geo.city || "Unknown",
            latitude: geo.ll ? geo.ll[0] : null,
            longitude: geo.ll ? geo.ll[1] : null
        } : { country: "Unknown", region: "Unknown", city: "Unknown" };

        // Save to database
        const trackingEntry = new TrackingModule({
            ...req.body,
            userId: userID,
            visitorId,
            sessionId,
            ip: normalizedIp,
            geoLocation
        });

        console.log(trackingEntry)

        await trackingEntry.save();

        // Increment event count
        user.eventsUsed += 1;
        console.log("Before saving eventsUsed:", user.eventsUsed);
        await user.save();
        console.log("After saving eventsUsed:", user.eventsUsed);
        res.status(200).json({ message: "Data received and stored successfully" });
    } catch (error) {
        console.error("Error saving tracking data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const getAnalysis = async (req, res) => {
    try {
        const { type, userId, websiteName, startDate, endDate } = req.query;

        console.log("startData: ", startDate);
        console.log("endDate: ", endDate);


        if (!userId || !websiteName) {
            return res.status(400).json({ message: "userId and websiteName are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId format." });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Date range validation
        const today = dayjs().startOf("day").toDate();
        const now = dayjs().endOf("day").toDate();

        const start = startDate && dayjs(startDate).isValid() ? new Date(startDate) : today;
        const end = endDate && dayjs(endDate).isValid() ? new Date(endDate) : now;

        end.setHours(23, 59, 59, 999); // Ensure the end date includes the full day

        // Calculate the previous date range for comparison
        const previousStart = dayjs(start).subtract(dayjs(end).diff(start, 'day') + 1, 'day').toDate();
        const previousEnd = dayjs(start).subtract(1, 'day').endOf("day").toDate();

        const calculatePercentageChange = (current, previous) => {
            if (previous === 0) return "N/A vs last period";
            const change = (((current - previous) / previous) * 100).toFixed(2);
            return `${change > 0 ? "+" : ""}${change}% vs last period`;
        };

        const response = {};

        // **1. Fetch Total Visitors**
        const currentVisitors = await TrackingModule.distinct("visitorId", {
            userId: userObjectId,
            websiteName,
            timestamp: { $gte: start, $lte: end },
        });
        const previousVisitors = await TrackingModule.distinct("visitorId", {
            userId: userObjectId,
            websiteName,
            timestamp: { $gte: previousStart, $lte: previousEnd },
        })

        response.totalVisitors = { count: currentVisitors.length, change: calculatePercentageChange(currentVisitors.length, previousVisitors.length) };

        // **2. Unique Click Rate**
        const getSessionData = async (rangeStart, rangeEnd) => {
            return await TrackingModule.aggregate([
                { $match: { userId: userObjectId, websiteName, timestamp: { $gte: rangeStart, $lte: rangeEnd } } },
                { $group: { _id: "$sessionId", isClick: { $max: { $cond: [{ $eq: ["$type", "click"] }, 1, 0] } } } }
            ]);
        };

        const currentSessionData = await getSessionData(start, end);
        const previousSessionData = await getSessionData(previousStart, previousEnd);

        const getClickRate = (sessionData) => {
            const totalUniqueClickVisitors = sessionData.length;
            const totalUniqueClicks = sessionData.filter((s) => s.isClick).length;
            return totalUniqueClickVisitors ? ((totalUniqueClicks / totalUniqueClickVisitors) * 100).toFixed(2) : 0;
        };

        const currentClickRate = getClickRate(currentSessionData);
        const previousClickRate = getClickRate(previousSessionData);
        response.clickRate = { rate: `${currentClickRate}%`, change: calculatePercentageChange(currentClickRate, previousClickRate) };

        // **3. Bounce Rate**
        const getBounceSessions = async (rangeStart, rangeEnd) => {
            return await TrackingModule.aggregate([
                { 
                    $match: { 
                        userId: userObjectId, 
                        websiteName, 
                        timestamp: { $gte: rangeStart, $lte: rangeEnd },
                        type: "page_visit"  // Only count page visits
                    } 
                },
                { 
                    $group: { 
                        _id: "$sessionId", 
                        uniquePages: { $addToSet: "$url" },  // Count unique pages visited
                        pageViews: { $sum: 1 }
                    } 
                },
                { 
                    $match: { 
                        $expr: { $eq: [{ $size: "$uniquePages" }, 1] }  // Only one unique page visited
                    } 
                }
            ]);
        };

        const currentBouncedSessions = await getBounceSessions(start, end);
        const previousBouncedSessions = await getBounceSessions(previousStart, previousEnd);
        const totalSessions = currentSessionData.length;
        const previousTotalSessions = previousSessionData.length;

        const getBounceRate = (bounced, total) => total ? ((bounced.length / total) * 100).toFixed(2) : 0;
        const currentBounceRate = getBounceRate(currentBouncedSessions, totalSessions);
        const previousBounceRate = getBounceRate(previousBouncedSessions, previousTotalSessions);
        response.bounceRate = { rate: `${currentBounceRate}%`, change: calculatePercentageChange(currentBounceRate, previousBounceRate) };


        // **4. Conversion Rate**
        const getConversionData = async (rangeStart, rangeEnd) => {
            return await TrackingModule.aggregate([
                { $match: { userId: userObjectId, websiteName, timestamp: { $gte: rangeStart, $lte: rangeEnd } } },
                { $group: { _id: "$sessionId", isConversion: { $max: { $cond: [{ $eq: ["$type", "conversion"] }, 1, 0] } } } }
            ]);
        };

        const currentConversions = await getConversionData(start, end);
        const previousConversions = await getConversionData(previousStart, previousEnd);
        const totalConversions = currentConversions.filter((c) => c.isConversion).length;
        const previousTotalConversions = previousConversions.filter((c) => c.isConversion).length;

        const getConversionRate = (conversions, total) => total ? ((conversions / total) * 100).toFixed(2) : 0;
        const currentConversionRate = getConversionRate(totalConversions, totalSessions);
        const previousConversionRate = getConversionRate(previousTotalConversions, previousTotalSessions);
        response.conversionRate = { rate: `${currentConversionRate}%`, change: calculatePercentageChange(currentConversionRate, previousConversionRate) };

        // **5. Active Users**
        const noww = new Date();
        const twoMinutesAgo = new Date(noww.getTime() - 2 * 60 * 1000);

        // Get active visitors who have interacted in the last 2 minutes
        const activeVisitors = await TrackingModule.distinct("visitorId", {
            websiteName,
            timestamp: { $gte: twoMinutesAgo },
        });

        response.activeUsers = {
            count: activeVisitors.length,
        };


        // **6. Device Data**
        const deviceData = await TrackingModule.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    websiteName,
                    timestamp: { $gte: start, $lte: end },
                    userAgent: { $ne: null },
                    visitorId: { $ne: null },
                },
            },
            {
                $group: {
                    _id: "$visitorId", // group by unique visitor
                    userAgent: { $first: "$userAgent" }, // take one userAgent per visitor
                },
            },
        ]);

        const osCounts = {}, browserCounts = {}, deviceCounts = {};

        deviceData.forEach(({ userAgent }) => {
            const parser = new UAParser(userAgent);
            const osName = parser.getOS().name || "Unknown";
            const browserName = parser.getBrowser().name || "Unknown";
            const deviceType = parser.getDevice().type || "Desktop";

            osCounts[osName] = (osCounts[osName] || 0) + 1;
            browserCounts[browserName] = (browserCounts[browserName] || 0) + 1;
            deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
        });

        const getFormattedData = (data) =>
            Object.keys(data)
                .filter((key) => key !== "Unknown")
                .map((key) => ({
                    name: key,
                    count: data[key],
                    percentage: ((data[key] / deviceData.length) * 100).toFixed(2),
                }));

        response.devices = {
            os: getFormattedData(osCounts),
            browser: getFormattedData(browserCounts),
            device: getFormattedData(deviceCounts),
        };



        // **7. Top Pages**
        const pageStats = await TrackingModule.aggregate([
            { 
                $match: { 
                    userId: userObjectId, 
                    websiteName, 
                    timestamp: { $gte: start, $lte: end },
                    type: "page_visit"  // Only count page visits
                } 
            },
            {
                $group: {
                    _id: "$url",
                    views: { $sum: 1 },
                    avgTimeSpent: { $avg: { $ifNull: ["$timeSpent", 0] } },  // Handle null timeSpent
                    sessions: { $addToSet: "$sessionId" },
                    uniqueVisitors: { $addToSet: "$visitorId" }
                }
            },
            { $sort: { views: -1 } },
            { $limit: 10 },
            {
                $project: {
                    url: "$_id",
                    views: 1,
                    avgTimeSpent: { $round: [{ $ifNull: ["$avgTimeSpent", 0] }, 2] },  // Handle null values
                    sessionCount: { $size: "$sessions" },
                    uniqueVisitors: { $size: "$uniqueVisitors" },
                    sessions: 1,
                    _id: 0
                }
            }
        ]);

        // Calculate bounce rate for each page
        for (const page of pageStats) {
            // Get all sessions that only visited this page
            const singlePageSessions = await TrackingModule.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        websiteName,
                        timestamp: { $gte: start, $lte: end },
                        type: "page_visit",
                        sessionId: { $in: page.sessions }
                    }
                },
                {
                    $group: {
                        _id: "$sessionId",
                        uniquePages: { $addToSet: "$url" }
                    }
                },
                {
                    $match: {
                        $expr: { $eq: [{ $size: "$uniquePages" }, 1] }
                    }
                }
            ]);

            // Calculate bounce rate for this page
            const bouncedSessions = singlePageSessions.filter(session => 
                session.uniquePages[0] === page.url
            ).length;

            // Ensure we don't divide by zero and handle edge cases
            const bounceRate = page.sessionCount > 0 
                ? ((bouncedSessions / page.sessionCount) * 100).toFixed(2)
                : "0.00";
            
            page.bounceRate = `${bounceRate}%`;
            
            // Ensure avgTimeSpent is a valid number
            page.avgTimeSpent = page.avgTimeSpent || 0;
        }

        response.topPages = pageStats;


        // Referral Source Analysis
        const searchEngines = ["google.com", "bing.com", "yahoo.com", "duckduckgo.com", "baidu.com"];
        const socialMedia = ["facebook.com", "twitter.com", "linkedin.com", "instagram.com", "reddit.com"];

        const categorizeReferrer = (referrer) => {
            if (!referrer || referrer === "direct" || referrer.trim() === "") return "direct";
            if (searchEngines.some(se => referrer.includes(se))) return "search";
            if (socialMedia.some(sm => referrer.includes(sm))) return "social";
            return "other"; // Other external sources
        };

        let referralStats = await TrackingModule.aggregate([
            { $match: { userId: userObjectId, websiteName, timestamp: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: "$referrer",
                    totalVisitors: { $addToSet: "$visitorId" },
                    totalConversions: { $sum: { $cond: [{ $eq: ["$type", "conversion"] }, 1, 0] } },
                    totalVisits: { $sum: 1 }
                }
            },
            {
                $project: {
                    referrer: { $ifNull: ["$_id", "direct"] },
                    visitors: { $size: "$totalVisitors" },
                    conversions: "$totalConversions",
                    visits: "$totalVisits",
                    category: { $literal: "" }, // Placeholder for category
                    _id: 0
                }
            },
            { $sort: { visits: -1 } }
        ]);

        referralStats = referralStats.map(ref => ({
            ...ref,
            category: categorizeReferrer(ref.referrer)
        }));

        response.referralStats = referralStats;


        // HeataMap Data
        const aggregatedVisitorsData = await TrackingModule.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    websiteName,
                    timestamp: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        time: { $dateToString: { format: "%Y-%m-%d %H", date: "$timestamp" } }
                    },
                    visitors: { $addToSet: "$visitorId" },
                },
            },
            {
                $project: {
                    time: "$_id.time",
                    visitors: { $size: "$visitors" },
                    _id: 0,
                },
            },
            { $sort: { time: 1 } },
        ]);

        // Convert the 24-hour time (e.g., "18") to 12-hour format ("6pm")
        // const convertTo12HourFormat = (hourString) => {
        //     const hour = parseInt(hourString, 10);
        //     const period = hour >= 12 ? 'pm' : 'am';
        //     const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        //     return `${hour12}${period}`;
        // };

        // const visitorsData12Hour = aggregatedVisitorsData.map(item => ({
        //     ...item,
        //     time: convertTo12HourFormat(item.time)
        // }));

        response.heatmapData = aggregatedVisitorsData;


        // **8. Visitors' Locations (Country, State, City)**

        // Get Visitors by Country
        const countryData = await TrackingModule.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    websiteName,
                    timestamp: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        country: "$geoLocation.country",
                        visitorId: "$visitorId",
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.country",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get Visitors by State
        const stateData = await TrackingModule.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    websiteName,
                    timestamp: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        state: "$geoLocation.region",
                        visitorId: "$visitorId",
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.state",
                    count: { $sum: 1 },
                },
            },
        ]);


        // Get Visitors by City
        const cityData = await TrackingModule.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    websiteName,
                    timestamp: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        city: "$geoLocation.city",
                        visitorId: "$visitorId",
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.city",
                    count: { $sum: 1 },
                },
            },
        ]);



        // Get total visitors count
        const totalVisitorsCount = currentVisitors.length;

        // Format data to include percentage
        const formatDataWithPercentage = (data) =>
            data.map(({ _id, count }) => ({
                name: _id || "Unknown",
                count,
                percentage: ((count / totalVisitorsCount) * 100).toFixed(2) + "%",
            }));

        const visitorsLocation = {
            totalVisitors: totalVisitorsCount,
            visitorCountries: formatDataWithPercentage(countryData),
            visitorStates: formatDataWithPercentage(stateData),
            visitorCities: formatDataWithPercentage(cityData),
        };

        response.visitorsLocation = visitorsLocation;


        return res.json(response);
    } catch (error) {
        console.error("Error fetching analysis:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};








export const getReferralStats = async (req, res) => {
    try {
        const { userId, websiteName } = req.query;

        if (!userId || !websiteName) {
            return res.status(400).json({ message: "userId and websiteName are required" });
        }

        // Aggregate referral sources and their visitor counts
        const referralSources = await TrackingModule.aggregate([
            {
                $match: { userId, websiteName }
            },
            {
                $group: {
                    _id: { $ifNull: [{ $trim: { input: "$referrer" } }, "Direct"] },
                    visitors: { $sum: 1 }
                }
            },
            { $sort: { visitors: -1 } }
        ]);

        const referralData = referralSources.map((source) => ({
            source: source._id || "Direct",
            visitors: source.visitors
        }));

        res.status(200).json({ referrals: referralData });
    } catch (error) {
        console.error("Error fetching referral stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get total number of tracked events
export const totalEvents = async (req, res) => {
    try {
        const { userId, websiteName } = req.query;

        const totalEvents = await TrackingModule.countDocuments({
            userId,
            websiteName
        });
        res.status(200).json({ totalEvents });
    } catch (error) {
        console.error("Error fetching total events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get events grouped by type
export const eventsByTypes = async (req, res) => {
    try {
        const { userId, websiteName } = req.query;

        const eventsByType = await TrackingModule.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), websiteName } },
            { $group: { _id: "$type", count: { $sum: 1 } } },
        ]);
        res.status(200).json(eventsByType);
    } catch (error) {
        console.error("Error fetching events by type:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get daily event counts
export const eventsDaily = async (req, res) => {
    try {
        const { userId, websiteName } = req.query;

        const dailyEvents = await TrackingModule.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), websiteName } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.status(200).json(dailyEvents);
    } catch (error) {
        console.error("Error fetching daily events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// API for retention metrics
export const userRetention = async (req, res) => {
    try {
        const { userId, websiteName } = req.query;

        const today = new Date();
        const metrics = {
            daily: await TrackingModule.countDocuments({
                userId: new mongoose.Types.ObjectId(userId),
                websiteName,
                timestamp: { $gte: new Date(today.setDate(today.getDate() - 1)) },
            }),
            weekly: await TrackingModule.countDocuments({
                userId: new mongoose.Types.ObjectId(userId),
                websiteName,
                timestamp: { $gte: new Date(today.setDate(today.getDate() - 7)) },
            }),
            monthly: await TrackingModule.countDocuments({
                userId: new mongoose.Types.ObjectId(userId),
                websiteName,
                timestamp: { $gte: new Date(today.setMonth(today.getMonth() - 1)) },
            })
        };

        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Click Heatmaps, aggregate click coordinates
export const heatmapData = async (req, res) => {
    try {
        const { userId, websiteName } = req.query;

        const clicks = await TrackingModule.aggregate([
            { $match: { userId, websiteName, type: 'click' } },
            { $group: { _id: { x: "$x", y: "$y" }, count: { $sum: 1 } } },
        ]);

        res.status(200).json(clicks);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Analyze average session durations
export const sessionTrends = async (req, res) => {
    try {
        const { userId, websiteName } = req.query;

        const sessions = await TrackingModule.aggregate([
            { $match: { userId, websiteName, type: 'session_end' } },
            { $group: { _id: "$sessionId", totalTime: { $sum: "$timeSpent" } } },
        ]);

        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};




