import { createConsentPopup } from './consent.js';
import { setCookie, getCookie, getSessionId, getVisitorId } from './storage.js';
import { getDeviceInfo } from './device.js';
import { getGeoLocation } from './geo.js';
import { extractUTMParams, sendData } from './api.js';
import io from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';

(function () {
    if (window.__TRACKER_LOADED__) return;
    window.__TRACKER_LOADED__ = true;

    const scriptTag = document.querySelector("script[data-website-id]");
    if (!scriptTag) {
        return;
    }

    const websiteId = scriptTag.getAttribute("data-website-id");
    const websiteName = scriptTag.getAttribute("website-name");

    // Initialize socket.io client
    const socket = io('https://backend.webmeter.in');
    // const socket = io('http://localhost:3000'); // Change to your backend URL in production

    async function trackUserActivity() {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const utmParams = extractUTMParams();
        const geoData = await getGeoLocation();
        const deviceInfo = getDeviceInfo();
        const entryPage = !sessionStorage.getItem("entryPage");
        sessionStorage.setItem("entryPage", "true");

        // Track navigation path
        let navigationPath = [window.location.pathname];
        sessionStorage.setItem("navigationPath", JSON.stringify(navigationPath));

        // Replace sendData with socket.emit for real-time events
        const sendRealtimeData = (data) => {
            data.websiteName = websiteName; // Ensure websiteName is always included
            socket.emit('trackerEvent', data);
            // Optionally, still call sendData for HTTP fallback/database
            sendData(data, websiteId, websiteName);
        };

        // Enhanced navigation tracking
        const updateNavigationPath = (newPath) => {
            navigationPath.push(newPath);
            // Keep only last 10 pages to avoid memory issues
            if (navigationPath.length > 10) {
                navigationPath = navigationPath.slice(-10);
            }
            sessionStorage.setItem("navigationPath", JSON.stringify(navigationPath));
            
            // Emit navigation event for real-time tracking
            socket.emit('navigation', {
                websiteName: websiteName,
                visitorId: visitorId,
                pages: navigationPath,
                timestamp: new Date().toISOString()
            });
        };

        const trackPageVisit = (isEntryPage = false) => {
            const currentPath = window.location.pathname;
            
            // Update navigation path if it's a new page
            if (navigationPath[navigationPath.length - 1] !== currentPath) {
                updateNavigationPath(currentPath);
            }

            const data = {
                type: "page_visit",
                sessionId,
                visitorId: visitorId,
                url: window.location.href,
                path: currentPath,
                referrer: document.referrer,
                entryPage: isEntryPage,
                utmParams,
                geoLocation: geoData,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
                timestamp: new Date().toISOString(),
            };
            sendRealtimeData(data);
        };

        // Track initial page visit
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
                const newPath = window.location.pathname;
                // Update navigation path for route changes
                if (navigationPath[navigationPath.length - 1] !== newPath) {
                    updateNavigationPath(newPath);
                }
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
            sendRealtimeData(clickData);

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
                sendRealtimeData(scrollData);
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
            sendRealtimeData(data);
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
            sendRealtimeData(pageEndData);

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
            sendRealtimeData(sessionEndData);
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
            sendRealtimeData(pageEndData);
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
                sendRealtimeData(pageEndData);
            } else if (document.visibilityState === "visible") {
                pageStartTime = Date.now();
                timeUpdateInterval = setInterval(sendTimeSpentData, 30000);
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
            }
        );
    }
})(); 