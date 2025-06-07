// Handles API calls and UTM extraction
import { API } from './config.js';
import { getVisitorId } from './storage.js';

export function extractUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
    };
}

export async function sendData(data, websiteId, websiteName) {
    data.visitorId = getVisitorId();
    data.userID = websiteId;
    data.websiteName = websiteName;

    try {
        const response = await fetch(API.TRACK, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Origin": window.location.origin
            },
            mode: "cors",
            credentials: "omit", // Changed from "include" to "omit" to avoid CORS issues
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Data send error:", error);
        // Don't throw the error, just log it to avoid breaking the user experience
        return null;
    }
} 