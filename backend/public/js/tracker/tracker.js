console.log("Main tracker loaded!");
import { createConsentPopup } from './consent.js';
import { setCookie, getCookie, getSessionId, getVisitorId } from './storage.js';
import { getDeviceInfo } from './device.js';
import { getGeoLocation } from './geo.js';
import { extractUTMParams, sendData } from './api.js';

(function () {
    if (window.__TRACKER_LOADED__) return;
    window.__TRACKER_LOADED__ = true;

    const scriptTag = document.querySelector("script[data-website-id]");
    if (!scriptTag) {
        return;
    }

    const websiteId = scriptTag.getAttribute("data-website-id");
    const websiteName = scriptTag.getAttribute("website-name");

    async function trackUserActivity() {
        // console.log("trackUserActivity called");
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const utmParams = extractUTMParams();
        const geoData = await getGeoLocation();
        // console.log("geoData loaded", geoData);
        const deviceInfo = getDeviceInfo();
        const entryPage = !sessionStorage.getItem("entryPage");
        sessionStorage.setItem("entryPage", "true");

        // Function to track page visit
        const trackPageVisit = (isEntryPage = false) => {
            const pageVisitData = {
                type: "page_visit",
                url: window.location.href,
                path: window.location.pathname,
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
                entryPage: isEntryPage,
                visitorId: visitorId,
                sessionId: sessionId,
                timeSpent: 0 // Always include timeSpent for initial event
            };
            console.log("trackPageVisit called", pageVisitData);
            sendData(pageVisitData, websiteId, websiteName);
        };

        // Track initial page visit
        // console.log("Calling trackPageVisit with entryPage =", entryPage);
        trackPageVisit(entryPage);

        // Track SPA route changes using a more robust approach
        let lastUrl = window.location.href;
        let lastPath = window.location.pathname;

        // Function to check if URL has actually changed
        const hasUrlChanged = () => {
            const currentUrl = window.location.href;
            const currentPath = window.location.pathname;
            const hasChanged = currentUrl !== lastUrl || currentPath !== lastPath;
            if (hasChanged) {
                lastUrl = currentUrl;
                lastPath = currentPath;
            }
            return hasChanged;
        };

        // Track route changes using multiple methods
        const trackRouteChange = () => {
            if (hasUrlChanged()) {
                trackPageVisit(false);
            }
        };

        // Method 1: History API
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            trackRouteChange();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            trackRouteChange();
        };

        // Method 2: PopState event
        window.addEventListener('popstate', trackRouteChange);

        // Method 3: HashChange event (for hash-based routing)
        window.addEventListener('hashchange', trackRouteChange);

        // Method 4: MutationObserver for DOM changes
        const observer = new MutationObserver((mutations) => {
            // Check if the URL has changed after DOM mutations
            if (hasUrlChanged()) {
            trackPageVisit(false);
            }
        });

        observer.observe(document, { 
            subtree: true, 
            childList: true,
            attributes: true,
            attributeFilter: ['href']
        });

        // Method 5: Click event handler for links
        document.addEventListener("click", (event) => {
            const link = event.target.closest("a");
            if (link && link.href && !link.href.startsWith("javascript:") && !link.href.startsWith("#")) {
                // Track click event
            const rect = event.target.getBoundingClientRect();
            const clickData = {
                type: "click",
                sessionId,
                    visitorId: visitorId,
                url: window.location.href,
                    path: window.location.pathname,
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

                // If it's a same-origin link, track it as a page visit
                if (link.hostname === window.location.hostname) {
                    setTimeout(trackRouteChange, 100); // Small delay to ensure URL has changed
                }
            }
        });

        // Rest of the tracking code (scroll, time spent, etc.)
        let lastScrollTime = 0;
        document.addEventListener("scroll", () => {
            const now = Date.now();
            if (now - lastScrollTime > 1000) {
                const scrollData = {
                    type: "scroll",
                    sessionId,
                    visitorId: visitorId,
                    url: window.location.href,
                    path: window.location.pathname,
                    scrollPosition: window.scrollY,
                    viewportHeight: window.innerHeight,
                    documentHeight: document.documentElement.scrollHeight,
                    timestamp: new Date().toISOString(),
                };
                sendData(scrollData, websiteId, websiteName);
                lastScrollTime = now;
            }
        });

        let pageStartTime = Date.now();
        let sessionStartTime = Date.now();
        let timeUpdateInterval;

        // Function to send time spent data
        const sendTimeSpentData = () => {
            const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
            const data = {
                type: "page_visit",
                sessionId,
                visitorId: visitorId,
                url: window.location.href,
                path: window.location.pathname,
                timeSpent: timeSpent,
                timestamp: new Date().toISOString(),
            };
            sendData(data, websiteId, websiteName);
        };

        // Start tracking time spent
        timeUpdateInterval = setInterval(sendTimeSpentData, 30000);

        // Track time spent on page when user leaves
        window.addEventListener("beforeunload", () => {
            clearInterval(timeUpdateInterval);
            const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
            const pageEndData = {
                type: "page_visit",
                sessionId,
                visitorId: visitorId,
                url: window.location.href,
                path: window.location.pathname,
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
                visitorId: visitorId,
                url: window.location.href,
                path: window.location.pathname,
                timeSpent: sessionTimeSpent,
                exitPage: true,
                timestamp: new Date().toISOString(),
            };
            sendData(sessionEndData, websiteId, websiteName);
        });

        // Track time spent on page when user navigates to a new page
        window.addEventListener("popstate", () => {
            clearInterval(timeUpdateInterval);
            const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
            const pageEndData = {
                type: "page_visit",
                sessionId,
                visitorId: visitorId,
                url: window.location.href,
                path: window.location.pathname,
                timeSpent: timeSpent,
                exitPage: true,
                timestamp: new Date().toISOString(),
            };
            sendData(pageEndData, websiteId, websiteName);
            pageStartTime = Date.now();
            timeUpdateInterval = setInterval(sendTimeSpentData, 30000);
        });

        // Track time spent when page visibility changes
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                clearInterval(timeUpdateInterval);
                const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
                const pageEndData = {
                    type: "page_visit",
                    sessionId,
                    visitorId: visitorId,
                    url: window.location.href,
                    path: window.location.pathname,
                    timeSpent: timeSpent,
                    exitPage: false,
                    timestamp: new Date().toISOString(),
                };
                sendData(pageEndData, websiteId, websiteName);
            } else if (document.visibilityState === "visible") {
                pageStartTime = Date.now();
                timeUpdateInterval = setInterval(sendTimeSpentData, 30000);
            }
        });
    }

    // console.log("About to check consent...");
    // console.log("Consent cookie value:", getCookie("trackingConsent"));
    // console.log("Consent cookie type:", typeof getCookie("trackingConsent"));
    // console.log("Consent cookie === 'true':", getCookie("trackingConsent") === "true");
    if (getCookie("trackingConsent") === "true") {
        console.log("Consent is true, calling trackUserActivity");
        trackUserActivity();
    } else {
        console.log("Consent is false, showing popup");
        createConsentPopup(
            () => {
                setCookie("trackingConsent", "true", 365);
                trackUserActivity();
            },
            () => {
            }
        );
    }
})(); 