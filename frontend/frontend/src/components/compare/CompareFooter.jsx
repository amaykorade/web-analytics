import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle, Shield, Clock, ArrowRight } from 'lucide-react';

export default function CompareFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* CTA Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Leave Complexity Behind?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Join hundreds of SaaS founders who switched to WebMeter for simpler, more actionable analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Try WebMeter Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/#demo"
              className="border-2 border-white/50 hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Demo</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" />No credit card required</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-400" />14-day free trial</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-yellow-400" />5-minute setup</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-800 mb-16"></div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16 text-center sm:text-left">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/#demo" className="text-base text-gray-300 hover:text-white">Demo</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Compare</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/compare/webmeter-vs-ga4" className="text-base text-gray-300 hover:text-white">vs. Google Analytics 4</Link></li>
              <li><Link to="/compare/webmeter-vs-plausible" className="text-base text-gray-300 hover:text-white">vs. Plausible</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/privacy" className="text-base text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/legal/terms-and-conditions" className="text-base text-gray-300 hover:text-white">Terms of Service</Link></li>
               <li><Link to="/legal/refund-cancellation" className="text-base text-gray-300 hover:text-white">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
               <li><Link to="/legal/contact-us" className="text-base text-gray-300 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Brand and Social */}
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo4.png" alt="Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-white">WebMeter</span>
              </div>
              <p className="text-sm text-gray-400 text-center md:text-left max-w-md">
                Transform your website data into actionable insights that drive revenue growth.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
    </footer>
  );
} 