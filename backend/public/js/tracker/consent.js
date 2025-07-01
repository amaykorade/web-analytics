// Handles consent popup and logic

export function createConsentPopup(onAccept, onDecline) {
    const consentDiv = document.createElement("div");
    consentDiv.innerHTML = `
        <div id="cookie-consent" style="
position: fixed;
bottom: 24px;
left: 50%;
transform: translateX(-50%);
max-width: 600px;
background: rgba(255,255,255,0.75);
backdrop-filter: blur(8px); 
padding: 18px 24px;
box-shadow: 0 6px 24px rgba(0,0,0,0.12);
border-radius: 10px;
text-align: center;
font-family: 'Segoe UI', Arial, sans-serif;
font-size: 15px;
line-height: 1.7;
z-index: 1000;">
  <div style="font-weight: 600; color: #222; font-size: 17px; margin-bottom: 6px;">Analytics & Cookies</div>
  <div style="color: #444; margin-bottom: 14px;">
    We use cookies for analytics to improve your experience. <br>
    <span style="color:#1a7cff; font-weight:500;">No personal data is collected.</span>
    See our <a href="https://www.webmeter.in/privacy" style="color: #1a7cff; text-decoration:underline;">Privacy Policy</a>.
  </div>
  <div style="margin-top: 10px;">
    <button id="consent-accept" style="
      background: #1a7cff;
      color: #fff;
      border: none;
      padding: 9px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 15px;
      margin-right: 8px;
      font-weight: 500;
      transition: background 0.2s;
    ">Accept</button>
    <button id="consent-decline" style="
      background: #e0e0e0;
      color: #333;
      border: none;
      padding: 9px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      transition: background 0.2s;
    ">Decline</button>
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