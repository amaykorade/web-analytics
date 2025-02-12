(function () {
    // Ensure the tracker doesn't load multiple times
    if (window.__TRACKER_LOADED__) return;
    window.__TRACKER_LOADED__ = true;

    const scriptTag = document.querySelector("script[data-website-id]");
    if (!scriptTag) {
        console.error("Tracker script missing required attributes.");
        return;
    }

    const websiteId = scriptTag.getAttribute("data-website-id");
    const websiteName = scriptTag.getAttribute("website-name");
    const domain = scriptTag.getAttribute("data-domain");
    const endpoint = "http://localhost:3000/api/data/track";
    const verificationEndpoint = "http://localhost:3000/api/script/verify-script";


    // Check if the script is correctly installed
    async function checkVerification() {
        try {
            const response = await fetch(verificationEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    url: domain,
                    userId: websiteId,
                    websiteName: websiteName
                }),
            })
            if (!response.ok) throw new Error("Verification failed");
            const result = await response.json();
            return result.verified;
        } catch (error) {
            console.error("Verification failed:", error);
            return false;
        }
    }

    function getVisitorId() {
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
            visitorId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
            localStorage.setItem("visitor_id", visitorId);
        }
        return visitorId;
    }

    async function startTracking() {
        const isVerified = await checkVerification();
        if (!isVerified) {
            console.warn("Tracking disabled: Script is not verified on the website.");
            return;
        }

        trackUserActivity();
    }

    // Extract UTM parameters from URL
    function extractUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utmSource: params.get("utm_source"),
            utmMedium: params.get("utm_medium"),
            utmCampaign: params.get("utm_campaign"),
        };
    }

    // Get user's geolocation using IP
    async function getGeoLocation() {
        try {
            const response = await fetch("https://ipapi.co/json/");
            return await response.json();
        } catch (error) {
            console.error("Geolocation fetch failed:", error);
            return null;
        }
    }

    // Generate or retrieve session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem("session_id");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem("session_id", sessionId);
        }
        return sessionId;
    }

    // Get devive info
    function getDeviceInfo() {
        const userAgent = navigator.userAgent.toLowerCase();
        let browser = "unknown";
        let deviceType = "Desktop";

        if (userAgent.includes("chrome")) browser = "Chrome";
        else if (userAgent.includes("firefox")) browser = "Firefox";
        else if (userAgent.includes("safari")) browser = "Safari";
        else if (userAgent.includes("edge")) browser = "Edge";
        else if (userAgent.includes("opera") || userAgent.includes("opr")) browser = "Opera";

        if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) deviceType = "Mobile";

        return { browser, deviceType };
    }

    async function sendData(data) {
        data.visitorId = getVisitorId();
        data.userID = websiteId;
        data.websiteName = websiteName;
        // console.log("Sending data:", data);

        try {
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
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
            platorm: navigator.platorm,
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
    startTracking();
})();