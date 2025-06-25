  import React from 'react';
import { Check, X, ArrowRight, Zap, Users, BarChart3, Clock, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompareFooter from './CompareFooter';

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
            <a
                href="#features"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Compare Features
              </a>
          </div>
          <div className="flex justify-center items-center space-x-6 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" />
              14-day free trial
            </span>
          </div>
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
      <CompareFooter />
    </div>
  );
} 