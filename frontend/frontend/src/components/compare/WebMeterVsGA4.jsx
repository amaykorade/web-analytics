import React from 'react';
import { Check, X, ArrowRight, Zap, Users, BarChart3, Clock, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WebMeterVsGA4() {
  const features = [
    { feature: "Easy funnel setup", webmeter: true, ga4: false, description: "Set up conversion funnels in minutes, not hours" },
    { feature: "Clean UI for beginners", webmeter: true, ga4: false, description: "Intuitive interface designed for non-analysts" },
    { feature: "Pricing", webmeter: "$9/mo (transparent)", ga4: "Free, but complex", description: "Predictable pricing vs hidden complexity costs" },
    { feature: "Ideal for early startups", webmeter: true, ga4: false, description: "Built specifically for growing SaaS companies" },
    { feature: "Real-time insights", webmeter: true, ga4: "Delayed", description: "See user behavior as it happens" },
    { feature: "Customer support", webmeter: "Personal support", ga4: "Community forums", description: "Get help when you need it most" },
    { feature: "Data privacy compliance", webmeter: true, ga4: "Complex setup", description: "GDPR & CCPA ready out of the box" },
    { feature: "Custom dashboards", webmeter: true, ga4: "Requires expertise", description: "Build dashboards without technical knowledge" }
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: "5-Minute Setup",
      description: "Get insights flowing in minutes, not days. No complex configuration required."
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Built for SaaS Founders",
      description: "Every feature designed with startup needs in mind - from MVP to scale."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      title: "Actionable Analytics",
      description: "Focus on metrics that matter: conversion rates, user journeys, and revenue impact."
    }
  ];

  const testimonials = [
    {
      quote: "Switched from GA4 to WebMeter and finally understand our user behavior. Setup was incredibly simple.",
      author: "Sarah Chen",
      role: "Founder, TechFlow"
    },
    {
      quote: "GA4 felt like using a rocket ship to go to the grocery store. WebMeter is exactly what we needed.",
      author: "Marcus Rodriguez",
      role: "CTO, StartupLab"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
     
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>The Simple Alternative to GA4</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            WebMeter vs GA4:<br />
            <span className="text-blue-600">The Simple Funnel-Focused</span><br />
            Alternative to GA4
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop wrestling with GA4's complexity. Get the insights you need with an analytics tool built specifically for SaaS startups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Try WebMeter Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
                to="/#demo"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                View Demo
              </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose WebMeter?</h2>
            <p className="text-lg text-gray-600">Built for startups who need insights, not complexity</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section id="features" className="py-16 px-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
            <p className="text-lg text-gray-600">See how WebMeter simplifies what GA4 makes complex</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                      <div className="flex items-center justify-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>WebMeter</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">GA4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {features.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{row.feature}</div>
                          <div className="text-sm text-gray-500 mt-1">{row.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.webmeter === 'boolean' ? (
                          row.webmeter ? (
                            <div className="inline-flex items-center space-x-1 text-green-600">
                              <Check className="w-5 h-5" />
                              <span className="font-medium">Yes</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center space-x-1 text-red-500">
                              <X className="w-5 h-5" />
                              <span className="font-medium">No</span>
                            </div>
                          )
                        ) : (
                          <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                            {row.webmeter}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.ga4 === 'boolean' ? (
                          row.ga4 ? (
                            <div className="inline-flex items-center space-x-1 text-green-600">
                              <Check className="w-5 h-5" />
                              <span className="font-medium">Yes</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center space-x-1 text-red-500">
                              <X className="w-5 h-5" />
                              <span className="font-medium">Complex</span>
                            </div>
                          )
                        ) : (
                          <span className="font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {row.ga4}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Switch from GA4 to WebMeter?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">GA4 is Powerful, But Bloated</h3>
                  <p className="text-gray-600">GA4 is designed for enterprise teams with dedicated analysts. Most SaaS founders don't need 90% of its features.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">WebMeter is Focused</h3>
                  <p className="text-gray-600">Built specifically for startups to understand user behavior quickly. No data science degree required.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Setup Takes 5 Minutes</h3>
                  <p className="text-gray-600">While GA4 requires hours of configuration, WebMeter gets you insights in minutes with our simple setup process.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect for Early Stage</h3>
                <p className="text-gray-600 mb-6">Focus on growing your product, not learning complex analytics tools. WebMeter gives you the insights you need without the overwhelm.</p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-1">$9/mo</div>
                  <div className="text-sm text-gray-500">vs GA4's hidden complexity costs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section id="testimonials" className="py-16 px-6 bg-gray-50">
        ...
      </section> */}

      {/* Footer */}
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
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>5-minute setup</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-800 mb-16"></div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16 text-center sm:text-left">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#demo" className="text-base text-gray-300 hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Compare</h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/compare/webmeter-vs-ga4" className="text-base text-gray-300 hover:text-white"> vs. Google Analytics 4</Link></li>
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
                <span className="text-xl font-bold text-white">Analytics</span>
              </div>
              <p className="text-sm text-gray-400 text-center md:text-left max-w-md">
                Transform your website data into actionable insights that drive revenue growth.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 