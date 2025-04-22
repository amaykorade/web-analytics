import React from "react";
import { Users, Phone, Mail, MapPin, Building, Globe } from "lucide-react";

export default function ContactPage() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-IN"); // e.g., 22/04/2025
  const formattedDateTime = currentDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with Stats Cards - Similar to your analytics UI */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <Users size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-xl font-semibold">{formattedDate}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <Phone size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Telephone</div>
              <div className="text-xl font-semibold">7276401153</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <Mail size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Email Support</div>
              <div className="text-md font-semibold">contact@webmeter.in</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <MapPin size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="text-md font-semibold">Pune, Maharashtra</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <Globe size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">PIN Code</div>
              <div className="text-xl font-semibold">411041</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Company Information
            </h2>

            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 text-indigo-600 mr-4">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Legal Entity Name
                  </h3>
                  <p className="text-gray-600">AMAY RAMALING KORADE</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 text-indigo-600 mr-4">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Registered Address
                  </h3>
                  <p className="text-gray-600">
                    Ekdant corner, Pune, Maharashtra, PIN: 411041
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 text-indigo-600 mr-4">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Operational Address
                  </h3>
                  <p className="text-gray-600">
                    Ekdant corner, Pune, Maharashtra, PIN: 411041
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 text-indigo-600 mr-4">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Contact Number
                  </h3>
                  <p className="text-gray-600">7276401153</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 text-indigo-600 mr-4">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Email Address
                  </h3>
                  <p className="text-gray-600">contact@webmeter.in</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Business Hours
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Monday - Friday</p>
                  <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Saturday</p>
                  <p className="text-gray-600">10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Sunday</p>
                  <p className="text-gray-600">Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
          <p>© 2025 AMAY RAMALING KORADE. All rights reserved.</p>
          <p className="mt-2">Last updated on {formattedDateTime}</p>
        </div>
      </div>
    </div>
  );
}
