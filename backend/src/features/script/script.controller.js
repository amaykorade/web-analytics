import axios from "axios";
import ScriptModel from "./script.schema.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
console.log("TRACKER_BASE_URL:", process.env.TRACKER_BASE_URL);
const TRACKER_BASE_URL = process.env.TRACKER_BASE_URL || "https://backend.webmeter.in";

export const getAllURL = async (req, res) => {
    try {
        const results = await ScriptModel.find({}, "url");
        const uniqueOrigins = new Set();

        results.forEach(result => {
            try {
                const urlObj = new URL(result.url);
                uniqueOrigins.add(urlObj.origin);
            } catch (error) {
                console.error(`Invalid URL: ${result.url}`, error);
            }
        });

        return Array.from(uniqueOrigins);
    } catch (error) {
        console.error("Error fetching origins:", error);
        return [];
    }
}

export const getUserScripts = async (req, res) => {
    try {
        const userId = req.userID;
        console.log("getUserScript - User ID:", userId);

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch all scripts associated with the user
        const scripts = await ScriptModel.find({ userId });
        console.log("Fetched scripts for user:", JSON.stringify(scripts, null, 2));

        // Return scripts with verification status
        return res.status(200).json({ 
            scripts, 
            isPresent: scripts.length > 0 
        });
    } catch (error) {
        console.error("Error fetching scripts:", error);
        return res.status(500).json({ 
            message: "Failed to retrieve script data", 
            isPresent: false 
        });
    }
};

export const getUserScript = async (req, res) => {
    try {
        const userId = req.userID || req.query.userId;
        const websiteName = req.query.websiteName;

        if (!userId || !websiteName) {
            return res.status(400).json({ message: "userId and websiteName are required" });
        }

        const scripts = await ScriptModel.find({ userId, websiteName });
        res.status(200).json(scripts);
    } catch (error) {
        console.error("Error getting user script:", error);
        res.status(500).json({ message: "Error getting user script" });
    }
};

export const generateScript = async (req, res) => {
    try {
        const { websiteName, userId } = req.body;

        if (!websiteName || !userId) {
            return res.status(400).json({ message: "websiteName and userId are required" });
        }

        const script = new ScriptModel({
            websiteName,
            userId,
            scriptId: `script_${Date.now()}`,
            status: "active"
        });

        await script.save();
        res.status(201).json(script);
    } catch (error) {
        console.error("Error generating script:", error);
        res.status(500).json({ message: "Error generating script" });
    }
};

export const verifyScript = async (req, res) => {
    try {
        const { websiteName, scriptId } = req.body;

        if (!websiteName || !scriptId) {
            return res.status(400).json({ message: "websiteName and scriptId are required" });
        }

        const formattedURL = websiteName.startsWith('http') ? websiteName : `https://${websiteName}`;
        const response = await fetch(formattedURL);
        const htmlContent = await response.text();

        const scriptTag = htmlContent.includes(scriptId);
        const status = scriptTag ? "verified" : "not_found";

        await ScriptModel.findOneAndUpdate(
            { scriptId },
            { status },
            { new: true }
        );

        res.status(200).json({ status });
    } catch (error) {
        console.error("Error verifying script:", error);
        res.status(500).json({ message: "Error verifying script" });
    }
};

export const verifyScriptInstallation = async (req, res) => {
    try {
        console.log("Verification request body:", req.body);
        const { url, name, userId } = req.body;

        const websiteName = name;

        if (!url || !userId || !websiteName) {
            return res.status(400).json({ 
                message: "Website URL, User ID, and Website Name are required" 
            });
        }

        // Ensure the URL starts with http:// or https://
        const formattedURL = url.startsWith("http") ? url : `https://${url}`;
        console.log(`Checking script on ${formattedURL} for ${websiteName}`);

        // Fetch the website's HTML
        const response = await axios.get(formattedURL, { timeout: 5000 });
        const htmlContent = response.data;

        // Log the first part of HTML content for debugging
        console.log("HTML Content Preview:", htmlContent.substring(0, 500));

        const scriptRegex = new RegExp(
            `<script[^>]*data-website-id=["']${userId}["'][^>]*data-domain=["']${url}["'][^>]*src=["']${TRACKER_BASE_URL}/js/tracker.js["'][^>]*>`,
            "i"
        );

        const nameRegex = new RegExp(websiteName, "i");

        const isScriptInstalled = scriptRegex.test(htmlContent);
        const isNamePresent = nameRegex.test(htmlContent);

        console.log("Verification Results:", {
            isScriptInstalled,
            isNamePresent,
            userId,
            url,
            websiteName,
            TRACKER_BASE_URL
        });

        if (isScriptInstalled && isNamePresent) {
            // Update the script verification status in the database
            const script = await ScriptModel.findOne({ url, userId });
            if (script) {
                script.isVerified = true;
                script.verifiedAt = new Date();
                await script.save();

                return res.status(200).json({
                    message: "Script and website name verified successfully",
                    verified: true,
                    scriptId: script._id,
                    isVerified: true
                });
            }
        }

        return res.status(400).json({
            message: "Script or website name not found. Please check your installation.",
            verified: false,
            isVerified: false,
            debug: {
                isScriptInstalled,
                isNamePresent,
                userId,
                url,
                websiteName
            }
        });
    } catch (error) {
        console.error("Error verifying script:", error);
        return res.status(500).json({ 
            message: "Failed to verify script installation. Ensure the URL is correct and accessible.", 
            verified: false,
            isVerified: false,
            error: error.message
        });
    }
};