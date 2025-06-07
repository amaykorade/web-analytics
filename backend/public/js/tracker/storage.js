// Handles storage: cookies, localStorage, sessionStorage

export function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
}

export function getVisitorId() {
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
        visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("visitor_id", visitorId);
    }
    return visitorId;
}

export function getSessionId() {
    let sessionId = sessionStorage.getItem("session_id");
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("session_id", sessionId);
    }
    return sessionId;
} 