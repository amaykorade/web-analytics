import('./tracker/tracker.js');

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
            <div id="cookie-consent" style="
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 500px;
    background: #fff;
    padding: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    z-index: 1000;
">
    <h3 style="margin-top: 0; color: #333;">We Value Your Privacy</h3>
    <p style="color: #555; margin-bottom: 12px;">
        We use cookies and similar tracking technologies to enhance your experience, analyze site usage, 
        and improve our services. By clicking <strong>"Accept"</strong>, you consent to us collecting the following data:
    </p>
    <ul style="text-align: left; padding-left: 20px; color: #555; margin-bottom: 12px;">
        <li>Pages you visit and time spent on each</li>
        <li>Your interactions (e.g., clicks, scrolls) to enhance usability</li>
        <li>Session details to personalize content and optimize performance</li>
        <li>Device and browser information for improving compatibility</li>
    </ul>
    <p style="color: #555; margin-bottom: 12px;">
        <strong>We do NOT collect</strong> personal or sensitive information like passwords, financial data, 
        or private messages. Your data is <strong>secure</strong> and will <strong>never be shared with third parties without consent.</strong>
        You can change your preferences anytime in our <a href="https://www.webmeter.in/privacy" style="color: #007bff; text-decoration: none;">Privacy Policy</a>.
    </p>
    <div style="margin-top: 15px;">
        <button id="consent-accept" style="
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        ">✅ Accept & Continue</button>
        
        <button id="consent-decline" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        ">❌ Decline</button>
    </div>
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
    const verificationEndpoint = "https://backend.webmeter.in/api/script/verify-script";

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
