import geoip from 'geoip-lite';
import { TrackingModule } from './tracking.schema.js';
import mongoose, { Mongoose } from 'mongoose';
import { format } from 'path';
import dayjs from 'dayjs';
import { UAParser } from 'ua-parser-js';





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


        // Get the client's IP address
        const ip =
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.connection?.remoteAddress || // Legacy connection-based IP
            req.socket?.remoteAddress || // Modern connection-based IP
            req.connection?.socket?.remoteAddress || // Nested socket case
            '127.0.0.1'; // Default to localhost

        console.log("Extracted IP:", ip);

        const normalizedIp = ip === "::1" ? "127.0.0.1" : ip;

        const isPrivateIp = (ip) => /^127\./.test(ip) || /^10\./.test(ip) || /^192\.168\./.test(ip) || ip === "::1";


        // Get geolocation based on IP
        const geo = !isPrivateIp(normalizedIp) ? geoip.lookup(normalizedIp) : null;
        const geoLocation = geo ? {
            country: geo.country,
            region: geo.region,
            city: geo.city,
            latitude: geo.ll?.[0],
            longitude: geo.ll?.[1]
        } : { country: "Unknown", region: "Unknown", city: "Unknown" };

        // Save to database
        const trackingEntry = new TrackingModule({
            ...req.body,
            userId: userID,
            visitorId,
            sessionId,
            ip,
            geoLocation
        });

        console.log(trackingEntry)

        await trackingEntry.save();
        // console.log("Data saved:", trackingEntry);
        res.status(200).json({ message: "Data received and stored successfully" });
    } catch (error) {
        console.error("Error saving tracking data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const getAnalysis = async (req, res) => {
    try {
        const { type, userId, websiteName, startDate, endDate } = req.query;
        console.log(req.query);

        if (!userId || !websiteName) {
            return res.status(400).json({ message: "userId and websiteName are required" });
        }

        // Ensure the userId is a valid ObjectId
        const userObjectId = mongoose.Types.ObjectId.isValid(userId)
            ? new mongoose.Types.ObjectId(userId)
            : null;

        if (!userObjectId) {
            return res.status(400).json({ message: "Invalid userId format." });
        }

        // Default date range: Today (Start & End of the current day)
        const today = dayjs().startOf("day").toDate();
        const now = dayjs().endOf("day").toDate();

        const start = startDate ? new Date(startDate) : today;
        let end = endDate ? new Date(endDate) : now;

        end.setHours(23, 59, 59, 999);

        // Initialize response object
        const response = {};

        // ********** Total Visitors ***********************
        const totalVisitors = await TrackingModule.distinct("visitorId", {
            userId,
            websiteName,
            timestamp: { $gte: start, $lte: end },
        });

        response.totalVisitors = {
            count: totalVisitors.length,
        };

        // ******************** Unique Click Rate

        // Count unique visitors by session
        const uniqueClickVisitors = await TrackingModule.aggregate([
            { $match: { userId: userObjectId, websiteName, timestamp: { $gte: start, $lte: end } } },
            { $group: { _id: "$sessionId" } },
        ]);

        // console.log("uniqueClickVisitors: ", uniqueClickVisitors)

        // console.log("Start Time:", start);
        // console.log("End Time:", end);

        const totalUniqueClickVisitors = uniqueClickVisitors.length;

        // Count unique clicks by session
        const uniqueClicks = await TrackingModule.aggregate([
            { $match: { userId: userObjectId, websiteName, type: "click", timestamp: { $gte: start, $lte: end } } },
            { $group: { _id: "$sessionId" } },
        ]);

        // console.log("uniqueClicks: ", uniqueClicks)


        const totalUniqueClicks = uniqueClicks.length;

        const clickRate = totalUniqueClickVisitors
            ? ((totalUniqueClicks / totalUniqueClickVisitors) * 100).toFixed(2)
            : 0;

        response.clickRate = {
            rate: `${clickRate}%`,
            totalClicks: totalUniqueClicks,
        };

        // Bounce Rate

        const bouncedSessions = await TrackingModule.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    websiteName,
                    timestamp: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: "$sessionId",
                    pagesVisited: { $sum: 1 }
                }
            },
            {
                $match: { pagesVisited: 1 }
            }, // Only sessions with one page view
        ]);

        // Total sessions (not visitors)
        const totalSessions = await TrackingModule.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    websiteName,
                    timestamp: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: "$sessionId",
                }
            } // Group by sessionId to count total sessions
        ]);

        const bounceRate = totalSessions.length
            ? ((bouncedSessions.length / totalSessions.length) * 100).toFixed(2)
            : 0;

        response.bounceRate = {
            rate: `${bounceRate}%`,
            bouncedSessions: bouncedSessions.length,
        };

        // Conversion Rate **************************************

        const conversionQuery = { userId: userObjectId, websiteName, timestamp: { $gte: start, $lte: end } };

        // Fetch unique visitors by session
        const uniqueVisitorsBySession = await TrackingModule.aggregate([
            { $match: conversionQuery },
            { $group: { _id: "$sessionId" } },
        ]);

        // Fetch unique conversions by session
        const conversions = await TrackingModule.aggregate([
            { $match: { ...conversionQuery, type: "conversion" } },
            { $group: { _id: "$sessionId" } },
        ]);

        const conversionRate = uniqueVisitorsBySession.length
            ? ((conversions.length / uniqueVisitorsBySession.length) * 100).toFixed(2)
            : 0;

        // Segment conversions by traffic source
        const conversionBySource = await TrackingModule.aggregate([
            { $match: { ...conversionQuery, type: "conversion" } },
            { $group: { _id: "$trafficSource", count: { $sum: 1 } } },
            { $project: { source: "$_id", conversions: "$count", _id: 0 } },
        ]);

        response.conversionRate = {
            rate: `${conversionRate}%`,
            totalConversions: conversions.length,
            conversionBySource,
        };

        // Active Users
        const activeUsers = await TrackingModule.distinct("userId", {
            // userId: userObjectId,
            websiteName,
            timestamp: { $gte: start, $lte: end },
        });

        response.activeUsers = {
            count: activeUsers.length,
        };

        // Device Data (OS, Browser, Device) ************************************

        const matchQuery = {
            userId: userObjectId,
            websiteName: { $regex: websiteName, $options: "i" },
            timestamp: { $gte: start, $lte: end },
        };

        const uniqueTrackingData = await TrackingModule.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$userAgent" } }, // Group by userAgent instead of sessionId
            { $match: { _id: { $ne: null } } } // Remove null userAgent values
        ]);

        // console.log("Unique Tracking Data:", JSON.stringify(uniqueTrackingData, null, 2));

        const osCounts = {};
        const browserCounts = {};
        const deviceCounts = {};

        uniqueTrackingData.forEach((entry) => {
            const userAgent = entry._id;
            if (!userAgent) return;

            const parser = new UAParser(userAgent);
            const osName = parser.getOS().name || "Unknown";
            const browserName = parser.getBrowser().name || "Unknown";
            const deviceType = parser.getDevice().type || "Desktop";

            osCounts[osName] = (osCounts[osName] || 0) + 1;
            browserCounts[browserName] = (browserCounts[browserName] || 0) + 1;
            deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
        });

        const totalUsers = uniqueTrackingData.length;

        const getFormattedData = (data) =>
            Object.keys(data)
                .filter((key) => key !== "Unknown") // Remove Unknown data
                .map((key) => ({
                    name: key,
                    count: data[key],
                    percentage: ((data[key] / totalUsers) * 100).toFixed(2),
                }));

        response.devices = {
            os: getFormattedData(osCounts),
            browser: getFormattedData(browserCounts),
            device: getFormattedData(deviceCounts),
        };


        // Top Pages Analytics ***********************************************

        const pageStats = await TrackingModule.aggregate([
            { $match: { userId: userObjectId, websiteName, timestamp: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: "$url",
                    views: { $sum: 1 },
                    avgTimeSpent: { $avg: "$timeSpent" },
                    sessionIds: { $addToSet: "$sessionId" },
                    visitorIds: { $addToSet: "$visitorId" }  // Track unique visitors per page
                }
            },
            { $sort: { views: -1 } },
            { $limit: 10 },
            {
                $project: {
                    url: "$_id",
                    views: 1,
                    avgTimeSpent: { $round: ["$avgTimeSpent", 2] },
                    sessionIds: 1,
                    visitorIds: 1, // Include visitorIds in the result
                    _id: 0
                }
            },
        ]);

        for (let i = 0; i < pageStats.length; i++) {
            const page = pageStats[i];

            // Check for bounced sessions for each page (considering only unique visitors per page)
            const bouncedSessions = await TrackingModule.aggregate([
                { $match: { userId: userObjectId, websiteName, timestamp: { $gte: start, $lte: end }, url: page.url } },
                { $group: { _id: "$sessionId", pagesVisited: { $sum: 1 } } },
                { $match: { pagesVisited: 1 } }, // Bounced if only 1 page visited in the session
            ]);

            // Bounce rate calculation based on unique sessions (considering visitorId as well)
            const bounceRate = page.sessionIds.length
                ? ((bouncedSessions.length / page.sessionIds.length) * 100).toFixed(2)
                : 0;

            page.bounceRate = {
                rate: `${bounceRate}%`,
                bouncedSessions: bouncedSessions.length,
            };
        }

        response.topPages = pageStats.length > 0 ? pageStats : [];


        // Locations (Countries, States, Cities)  ******************************
        const locationData = await TrackingModule.aggregate([
            { $match: { userId: userObjectId, websiteName, timestamp: { $gte: start, $lte: end } } },
            { $group: { _id: { country: "$country", state: "$state", city: "$city" }, count: { $sum: 1 } } },
            { $project: { country: "$_id.country", state: "$_id.state", city: "$_id.city", count: 1, _id: 0 } },
        ]);

        const totalLocationVisitors = locationData.reduce((acc, item) => acc + item.count, 0);

        const locationFormattedData = locationData.map((location) => ({
            country: location.country,
            state: location.state,
            city: location.city,
            count: location.count,
            percentage: ((location.count / totalLocationVisitors) * 100).toFixed(2),
        }));

        response.locationData = locationFormattedData;

        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: "Internal server error" });
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




