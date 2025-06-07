// Handles geolocation
import { API } from './config.js';

export async function getGeoLocation() {
    try {
        const response = await fetch(API.GEO);
        return await response.json();
    } catch (error) {
        console.error("Geolocation fetch failed:", error);
        return null;
    }
} 