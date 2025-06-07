import { createConsentPopup } from './consent.js';
import { setCookie, getCookie, getSessionId } from './storage.js';
import { getDeviceInfo } from './device.js';
import { getGeoLocation } from './geo.js';
import { extractUTMParams, sendData } from './api.js';

(function () {
    if (window.__TRACKER_LOADED__) return;
    window.__TRACKER_LOADED__ = true;

    const scriptTag = document.querySelector("script[data-website-id]");
    if (!scriptTag) {
        console.error("Tracker script missing required attributes.");
        return;
    }

    const websiteId = scriptTag.getAttribute("data-website-id");
    const websiteName = scriptTag.getAttribute("website-name");

    async function trackUserActivity() {
        const sessionId = getSessionId();
        const utmParams = extractUTMParams();
        const geoData = await getGeoLocation();
        const deviceInfo = getDeviceInfo();
        const entryPage = !sessionStorage.getItem("entryPage");
        sessionStorage.setItem("entryPage", "true");

        const pageVisitData = {
            type: "page_visit",
            url: window.location.href,
            referrer: document.referrer,
            utmSource: utmParams.utmSource,
            utmMedium: utmParams.utmMedium,
            utmCampaign: utmParams.utmCampaign,
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            browser: deviceInfo.browser,
            deviceType: deviceInfo.deviceType,
            ip: geoData?.ip || null,
            geoLocation: {
                country: geoData?.country_name || null,
                region: geoData?.region || null,
                city: geoData?.city || null,
                latitude: geoData?.latitude || null,
                longitude: geoData?.longitude || null,
            },
            timestamp: new Date().toISOString(),
            entryPage,
        };

        sendData(pageVisitData, websiteId, websiteName);

        document.addEventListener("click", (event) => {
            const rect = event.target.getBoundingClientRect();
            const clickData = {
                type: "click",
                sessionId,
                url: window.location.href,
                elementClicked: {
                    tag: event.target.tagName,
                    id: event.target.id || null,
                    classes: event.target.className || null,
                    text: event.target.innerText || null,
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY,
                },
                timestamp: new Date().toISOString(),
            };
            sendData(clickData, websiteId, websiteName);
        });

        let lastScrollTime = 0;
        document.addEventListener("scroll", () => {
            const now = Date.now();
            if (now - lastScrollTime > 1000) {
                const scrollData = {
                    type: "scroll",
                    url: window.location.href,
                    scrollPosition: window.scrollY,
                    viewportHeight: window.innerHeight,
                    documentHeight: document.documentElement.scrollHeight,
                    timestamp: new Date().toISOString(),
                };
                sendData(scrollData, websiteId, websiteName);
                lastScrollTime = now;
            }
        });

        const sessionStartTime = Date.now();
        let pageStartTime = Date.now();

        // Track time spent on page when user leaves
        window.addEventListener("beforeunload", () => {
            const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
            const pageEndData = {
                type: "page_visit",
                sessionId,
                url: window.location.href,
                timeSpent: timeSpent,
                exitPage: true,
                timestamp: new Date().toISOString(),
            };
            sendData(pageEndData, websiteId, websiteName);

            // Also send session end data
            const sessionTimeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
            const sessionEndData = {
                type: "session_end",
                sessionId,
                url: window.location.href,
                timeSpent: sessionTimeSpent,
                exitPage: true,
                timestamp: new Date().toISOString(),
            };
            sendData(sessionEndData, websiteId, websiteName);
        });

        // Track time spent on page when user navigates to a new page
        window.addEventListener("popstate", () => {
            const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
            const pageEndData = {
                type: "page_visit",
                sessionId,
                url: window.location.href,
                timeSpent: timeSpent,
                exitPage: true,
                timestamp: new Date().toISOString(),
            };
            sendData(pageEndData, websiteId, websiteName);
            pageStartTime = Date.now();
        });

        // Track time spent on page when user clicks a link
        document.addEventListener("click", (event) => {
            const link = event.target.closest("a");
            if (link && link.href && !link.href.startsWith("javascript:") && !link.href.startsWith("#")) {
                const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
                const pageEndData = {
                    type: "page_visit",
                    sessionId,
                    url: window.location.href,
                    timeSpent: timeSpent,
                    exitPage: true,
                    timestamp: new Date().toISOString(),
                };
                sendData(pageEndData, websiteId, websiteName);
            }
        });
    }

    if (getCookie("trackingConsent") === "true") {
        trackUserActivity();
    } else {
        createConsentPopup(
            () => {
                setCookie("trackingConsent", "true", 365);
                trackUserActivity();
            },
            () => {
                setCookie("trackingConsent", "false", 365);
            }
        );
    }
})(); 