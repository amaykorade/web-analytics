// Handles device and browser info

export function getDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase();
    let browser = "unknown";
    let deviceType = /mobile|android|iphone|ipad|tablet/i.test(userAgent) ? "Mobile" : "Desktop";

    if (userAgent.includes("opr") || userAgent.includes("opera")) {
        browser = "Opera";
    } else if (userAgent.includes("edg")) {
        browser = "Edge";
    } else if (userAgent.includes("chrome") && !userAgent.includes("opr") && !userAgent.includes("edg")) {
        browser = "Chrome";
    } else if (userAgent.includes("firefox")) {
        browser = "Firefox";
    } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
        browser = "Safari";
    }

    return { browser, deviceType };
} 