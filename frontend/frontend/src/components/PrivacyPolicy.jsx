import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Settings, Mail, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Shield className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-center text-gray-600">
            Last updated: {currentDate}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Introduction */}
          <div className="p-8 border-b">
            <p className="text-gray-600">
              Welcome to WebAnalytics ("we," "our," or "us"). We respect your
              privacy and are committed to protecting it through this Privacy
              Policy. This policy explains how we collect, use, and safeguard
              your information when you use our website analytics and tracking
              services.
            </p>
          </div>

          {/* Information Collection */}
          <div className="p-8 border-b">
            <div className="flex items-start space-x-3 mb-6">
              <Eye className="h-6 w-6 text-indigo-600 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Information We Collect
                </h2>
                <p className="text-gray-600 mb-4">
                  We only collect non-personal information necessary for
                  analytics, with your consent.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      <strong>Page Visits</strong> – The pages you visit and the
                      time spent.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      <strong>Device & Browser Info</strong> – The type of
                      device and browser you use.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      <strong>Referral Data</strong> – How you arrived at the
                      website.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      <strong>User Interactions</strong> – Clicks, scroll depth,
                      and session activity.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      <strong>Geolocation</strong> – General location based on
                      browser settings (not IP-based).
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Collection Method */}
          <div className="p-8 border-b">
            <div className="flex items-start space-x-3 mb-6">
              <Lock className="h-6 w-6 text-indigo-600 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How We Collect Information
                </h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and session storage to temporarily store user
                  identifiers (with consent). You can manage or disable cookies
                  through your browser settings.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="h-5 w-5 text-indigo-600" />
                    <span>
                      We do not collect IP addresses or personally identifiable
                      information (PII).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="p-8 border-b">
            <div className="flex items-start space-x-3">
              <Settings className="h-6 w-6 text-indigo-600 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 mb-4">
                  The data collected is used for:
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Improving website performance and user experience
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Providing website owners with insights into visitor behavior
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Ensuring the security and stability of the website
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    We do not sell, rent, or share your data with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div className="p-8 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Rights & Choices
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Opt-Out of Tracking
                </h3>
                <p className="text-sm text-gray-600">
                  You can reject tracking via the consent popup.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Disable Cookies
                </h3>
                <p className="text-sm text-gray-600">
                  You can delete or block cookies via your browser.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Request Data Deletion
                </h3>
                <p className="text-sm text-gray-600">
                  Contact us to request removal of your data.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="p-8">
            <div className="flex items-start space-x-3">
              <Mail className="h-6 w-6 text-indigo-600 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    📧 Email: privacy@webanalytics.com
                  </p>
                  <p className="text-gray-600">🌐 Website: webanalytics.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
