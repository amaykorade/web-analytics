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
        await fetch(API.TRACK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Data send error:", error);
    }
} 