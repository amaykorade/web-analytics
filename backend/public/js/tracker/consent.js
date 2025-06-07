// Handles consent popup and logic

export function createConsentPopup(onAccept, onDecline) {
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
        onAccept();
        document.body.removeChild(consentDiv);
    });

    document.getElementById("consent-decline").addEventListener("click", () => {
        onDecline();
        document.body.removeChild(consentDiv);
    });
} 