import axios from "axios";
import ScriptModel from "./script.schema.js";


export const getAllURL = async (req, res) => {
    try {
        const results = await ScriptModel.find({}, "url");
        const urls = results.map(result => result.url)
        res.status(200).json({ success: true, urls })
    } catch (error) {
        console.error("Error fetching urls:", error);
        return res.status(500).json({ message: "Failed to retrieve url", });
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

        if (scripts.length === 0) {
            return res.status(404).json({ message: "No scripts found for this user" });
        }

        return res.status(200).json({ scripts: scripts, isPresent: true });
    } catch (error) {
        console.error("Error fetching scripts:", error);
        return res.status(500).json({ message: "Failed to retrieve script data", isPresent: fasle });
    }
};



export const generateScript = (req, res) => {
    try {
        console.log(req.body);
        const { url, name } = req.body;
        const userId = req.userID;

        // console.log(websiteURL);

        if (!url || !userId) {
            return res.status(400).json({ message: "Website URL and User ID are required" });
        }

        const script = ` <script 
        defer
        data-website-id="${userId}"
        data-domain="${url}"
        website-name="${name}"
        src="http://localhost:3000/js/tracker.js">
        </script> `

        res.status(200).json({ script });
    } catch (error) {
        console.error("Error generating script:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyScriptInstallation = async (req, res) => {
    try {
        const { url, websiteName } = req.body;
        const userId = req.userID;

        console.log("verify :", req.body)

        if (!url || !userId || !websiteName) {
            return res.status(400).json({ message: "Website URL, User ID, and Website Name are required" });
        }

        // Ensure the URL starts with http:// or https://
        const formattedURL = url.startsWith("http") ? url : `https://${url}`;
        console.log(`Checking script on ${formattedURL} for ${websiteName}`);

        // Check for duplication
        const existingScript = await ScriptModel.findOne({ url });
        if (existingScript) {
            return res.status(200).json({
                message: "Script is already registered for this URL.",
                verified: true
            });
        }

        // Fetch the website's HTML
        const response = await axios.get(formattedURL, { timeout: 5000 });
        const htmlContent = response.data;

        console.log("htmlContent:", htmlContent);

        const scriptRegex = new RegExp(
            `<script[^>]*data-website-id=["']${userId}["'][^>]*data-domain=["']${url}["'][^>]*src=["']http://localhost:3000/js/tracker.js["'][^>]*>`,
            "i"
        );

        // Check if the website name exists somewhere in the HTML content
        const nameRegex = new RegExp(websiteName, "i");

        const isScriptInstalled = scriptRegex.test(htmlContent);
        const isNamePresent = nameRegex.test(htmlContent);

        console.log(`Script Installed: ${isScriptInstalled}, Name Found: ${isNamePresent}`);

        if (isScriptInstalled && isNamePresent) {
            const newScript = new ScriptModel({ userId, url, websiteName });
            await newScript.save();

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