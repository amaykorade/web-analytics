(function () {
    if (window.__TRACKER_LOADED__) return;
    window.__TRACKER_LOADED__ = true;

    const scriptTag = document.querySelector("script[data-website-id]");
    if (!scriptTag) {
        console.error("Tracker script missing required attributes.");
        return;
    }

    function createConsentPopup() {
        const consentDiv = document.createElement("div");
        consentDiv.innerHTML = `
            <div style="position: fixed; bottom: 10px; left: 10px; right: 10px; padding: 15px; background: white; box-shadow: 0px 4px 6px rgba(0,0,0,0.1); border-radius: 5px; text-align: center;">
                <p>This website uses cookies for analytics. Do you consent?</p>
                <button id="consent-accept">Accept</button>
                <button id="consent-decline">Decline</button>
            </div>
        `;
        document.body.appendChild(consentDiv);

        document.getElementById("consent-accept").addEventListener("click", () => {
            document.cookie = "trackingConsent=true; path=/; max-age=" + 60 * 60 * 24 * 365; // 1 year
            document.body.removeChild(consentDiv);
            trackUserActivity(); // Start tracking after consent
        });

        document.getElementById("consent-decline").addEventListener("click", () => {
            document.cookie = "trackingConsent=false; path=/; max-age=" + 60 * 60 * 24 * 365;
            document.body.removeChild(consentDiv);
        });
    }


    const websiteId = scriptTag.getAttribute("data-website-id");
    const websiteName = scriptTag.getAttribute("website-name");
    const domain = scriptTag.getAttribute("data-domain");
    // const endpoint = "http://localhost:3000/api/data/track";
    const endpoint = "https://backend.webmeter.in/api/data/track";
    const verificationEndpoint = "http://localhost:3000/api/script/verify-script";

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
    }

    function getVisitorId() {
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
            visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem("visitor_id", visitorId);
        }
        return visitorId;
    }

    function getSessionId() {
        let sessionId = sessionStorage.getItem("session_id");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem("session_id", sessionId);
        }
        return sessionId;
    }

    function extractUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utmSource: params.get("utm_source"),
            utmMedium: params.get("utm_medium"),
            utmCampaign: params.get("utm_campaign"),
        };
    }

    async function getGeoLocation() {
        try {
            const response = await fetch("https://ipapi.co/json/");
            return await response.json();
        } catch (error) {
            console.error("Geolocation fetch failed:", error);
            return null;
        }
    }

    function getDeviceInfo() {
        const userAgent = navigator.userAgent.toLowerCase();
        let browser = "unknown";
        let deviceType = /mobile|android|iphone|ipad|tablet/i.test(userAgent) ? "Mobile" : "Desktop";

        if (userAgent.includes("opr") || userAgent.includes("opera")) {
            browser = "Opera";
        } else if (userAgent.includes("edg")) {
            browser = "Edge"; // Edge also uses Chromium
        } else if (userAgent.includes("chrome") && !userAgent.includes("opr") && !userAgent.includes("edg")) {
            browser = "Chrome";
        } else if (userAgent.includes("firefox")) {
            browser = "Firefox";
        } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
            browser = "Safari";
        }

        return { browser, deviceType };
    }

    async function sendData(data) {
        data.visitorId = getVisitorId();
        data.userID = websiteId;
        data.websiteName = websiteName;

        try {
            await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error("Data send error:", error);
        }
    }

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

        sendData(pageVisitData);

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
            sendData(clickData);
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
                sendData(scrollData);
                lastScrollTime = now;
            }
        });

        const sessionStartTime = Date.now();
        window.addEventListener("beforeunload", () => {
            const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
            const sessionEndData = {
                type: "session_end",
                sessionId,
                url: window.location.href,
                timeSpent: timeSpent,
                exitPage: true,
                timestamp: new Date().toISOString(),
            };
            sendData(sessionEndData);
        });
    }

    if (getCookie("trackingConsent") === "true") {
        trackUserActivity();
    } else {
        createConsentPopup();
    }
})();
