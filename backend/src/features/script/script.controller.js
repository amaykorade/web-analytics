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
        console.log("getUserScript: ", userId);
        // const userId = new mongoose.Types.ObjectId(req.userId)

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch all scripts associated with the user
        const scripts = await ScriptModel.find({ userId });

        return res.status(200).json({ scripts, isPresent: scripts.length > 0 });
    } catch (error) {
        console.error("Error fetching scripts:", error);
        return res.status(500).json({ message: "Failed to retrieve script data", isPresent: false });
    }
};



export const generateScript = async (req, res) => {
    try {
        console.log(req.body);
        const { url, name } = req.body;
        const userId = req.userID;

        // console.log(websiteURL);

        if (!url || !userId) {
            return res.status(400).json({ message: "Website URL and User ID are required" });
        }

        const existingScript = await ScriptModel.findOne({ url });

        const script = ` <script 
        defer
        data-website-id="${userId}"
        data-domain="${url}"
        website-name="${name}"
        src="${TRACKER_BASE_URL}/js/tracker.js">
        </script> `

        if (existingScript) {
            return res.status(200).json({ script });
        }

        const newScript = new ScriptModel({ userId, url, websiteName: name });
        await newScript.save();

        res.status(200).json({ script });
    } catch (error) {
        console.error("Error generating script:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyScriptInstallation = async (req, res) => {
    try {
        console.log("verify: ", req.body);
        const { url, name, userId } = req.body;
        // const userId = req.userID;

        const websiteName = name;

        console.log("verify :", req.body)

        if (!url || !userId || !websiteName) {
            return res.status(400).json({ message: "Website URL, User ID, and Website Name are required" });
        }

        // Ensure the URL starts with http:// or https://
        const formattedURL = url.startsWith("http") ? url : `https://${url}`;
        console.log(`Checking script on ${formattedURL} for ${websiteName}`);

        // // Check for duplication
        // const existingScript = await ScriptModel.findOne({ url, });
        // if (existingScript) {
        //     return res.status(200).json({
        //         message: "Script is already registered for this URL.",
        //         verified: true
        //     });
        // }

        // Fetch the website's HTML
        const response = await axios.get(formattedURL, { timeout: 5000 });
        const htmlContent = response.data;

        console.log("HTML Response:", htmlContent.slice(0, 1000))

        const scriptRegex = new RegExp(
            `<script[^>]*data-website-id=["']${userId}["'][^>]*data-domain=["']${url}["'][^>]*src=["']${TRACKER_BASE_URL}/js/tracker.js["'][^>]*>`,
            "i"
        );

        // Check if the website name exists somewhere in the HTML content
        const nameRegex = new RegExp(websiteName, "i");

        const isScriptInstalled = scriptRegex.test(htmlContent);
        const isNamePresent = nameRegex.test(htmlContent);

        console.log(`Script Installed: ${isScriptInstalled}, Name Found: ${isNamePresent}`);

        if (isScriptInstalled && isNamePresent) {
            // const newScript = new ScriptModel({ userId, url, websiteName });
            // await newScript.save();

            return res.status(200).json({
                message: "Script and website name verified successfully",
                verified: true
            });
        } else {
            return res.status(400).json({
                message: "Script or website name not found. Please check your installation.",
                verified: false
            });
        }
    } catch (error) {
        console.error("Error verifying script:", error);
        return res.status(500).json({ message: "Failed to verify script installation. Ensure the URL is correct and accessible.", verified: false });
    }
}