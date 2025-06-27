import axios from "axios";
import ScriptModel from "./script.schema.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const TRACKER_BASE_URL = process.env.TRACKER_BASE_URL || "https://backend.webmeter.in";
// const TRACKER_BASE_URL = "http://localhost:3000";


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

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch all scripts associated with the user
        const scripts = await ScriptModel.find({ userId });

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
        const { websiteName, userId, url } = req.body;

        if (!websiteName || !userId || !url) {
            return res.status(400).json({ message: "websiteName, userId, and url are required" });
        }

        const script = new ScriptModel({
            websiteName,
            userId,
            url,
            scriptId: `script_${Date.now()}`,
            status: "active"
        });

        await script.save();

        // Generate the tracking script tag
        const trackingScript = `<script 
    type="module" 
    data-website-id="${userId}" 
    data-domain="${url}" 
    website-name="${websiteName}" 
    src="${TRACKER_BASE_URL}/js/tracker.js">
</script>`;

        res.status(201).json({
            ...script.toObject(),
            script: trackingScript
        });
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
        const { url, name, userId } = req.body;

        const websiteName = name;

        if (!url || !userId || !websiteName) {
            return res.status(400).json({
                message: "Website URL, User ID, and Website Name are required"
            });
        }

        // Ensure the URL starts with http:// or https://
        const formattedURL = url.startsWith("http") ? url : `https://${url}`;

        // Fetch the website's HTML
        const response = await axios.get(formattedURL, { timeout: 5000 });
        const htmlContent = response.data;

        const scriptRegex = new RegExp(
            `<script[^>]*data-website-id=["']${userId}["'][^>]*data-domain=["']${url}["'][^>]*src=["']${TRACKER_BASE_URL}/js/tracker.js["'][^>]*>`,
            "i"
        );

        const nameRegex = new RegExp(websiteName, "i");

        const isScriptInstalled = scriptRegex.test(htmlContent);
        const isNamePresent = nameRegex.test(htmlContent);

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
        });
    } catch (error) {
        console.error("Error verifying script:", error);
        return res.status(500).json({
            message: "Failed to verify script installation. Ensure the URL is correct and accessible.",
            verified: false,
            isVerified: false,
        });
    }
};

export const deleteScript = async (req, res) => {
    try {
        const { scriptId } = req.params;
        const userId = req.userID;

        if (!scriptId || !userId) {
            return res.status(400).json({ message: "Script ID and User ID are required" });
        }

        // First, let's check if the script exists
        const existingScript = await ScriptModel.findById(scriptId);

        if (!existingScript) {
            return res.status(404).json({ message: "Script not found" });
        }

        if (existingScript.userId !== userId) {
            return res.status(403).json({ message: "You don't have permission to delete this script" });
        }

        // Find and delete the script, ensuring it belongs to the user
        const script = await ScriptModel.findOneAndDelete({ _id: scriptId, userId });
        
        if (!script) {
            return res.status(404).json({ message: "Script not found or you don't have permission to delete it" });
        }

        res.status(200).json({ 
            message: "Script deleted successfully", 
            scriptId: script._id,
            websiteName: script.websiteName 
        });
    } catch (error) {
        console.error("Error deleting script:", error);
        res.status(500).json({ message: "Error deleting script" });
    }
};