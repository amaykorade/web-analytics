import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">
                WebAnalytics
              </span>
            </div>
            <p className="text-gray-500 text-base">
              Making web analytics simple and actionable for businesses of all
              sizes.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links sections */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Product
                </h3>
                {/* <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      to="/features"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/docs"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/guides"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Guides
                    </Link>
                  </li>
                </ul> */}
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                {/* <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      to="/about"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/careers"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Contact
                    </Link>
                  </li>
                </ul> */}
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                {/* <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      to="/help"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/api"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      API Status
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/chat"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Live Chat
                    </Link>
                  </li>
                </ul> */}
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                {/* <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      to="/privacy"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/security"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Security
                    </Link>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} WebAnalytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
