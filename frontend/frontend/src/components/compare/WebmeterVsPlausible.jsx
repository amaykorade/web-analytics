import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Zap, Users, BarChart3, Clock, Shield, Sparkles, TrendingUp, Target, Activity, CheckCircle } from 'lucide-react';
import CompareFooter from './CompareFooter';

export default function WebMeterPlausibleComparison() {
  const features = [
    { 
      feature: "Funnel Tracking", 
      webmeter: "Built-in, visual funnels", 
      plausible: false, 
      description: "Visual funnel analysis to see exactly where users drop off",
      webmeterDetail: "Yes — Built-in, visual funnels",
      plausibleDetail: "No funnel tracking"
    },
    { 
      feature: "User Journey Tracking (event-level)", 
      webmeter: "Full event tracking", 
      plausible: "Basic events only", 
      description: "Track every user interaction and behavior pattern",
      webmeterDetail: "Yes — Full event tracking",
      plausibleDetail: "Only page views & basic events"
    },
    { 
      feature: "SaaS Growth Metrics Focus", 
      webmeter: true, 
      plausible: false, 
      description: "Metrics specifically designed for SaaS business growth",
      webmeterDetail: "Yes — Focused on SaaS founders",
      plausibleDetail: "Geared for general website owners"
    },
    { 
      feature: "Event-Based Pricing", 
      webmeter: true, 
      plausible: true, 
      description: "Pricing that scales with your actual usage",
      webmeterDetail: "Yes — Scales with usage",
      plausibleDetail: "Yes"
    },
    { 
      feature: "Simple Onboarding", 
      webmeter: true, 
      plausible: true, 
      description: "Get started quickly without complex setup",
      webmeterDetail: "Yes — 5-min setup",
      plausibleDetail: "Yes — Simple setup"
    },
    { 
      feature: "Goal Conversion Tracking", 
      webmeter: "Custom goals + funnels", 
      plausible: "Limited goals only", 
      description: "Advanced goal tracking with funnel visualization",
      webmeterDetail: "Yes — Custom goals + funnels",
      plausibleDetail: "Limited (simple goals only)"
    },
    { 
      feature: "Real-Time User Behavior", 
      webmeter: true, 
      plausible: "Traffic count only", 
      description: "See user actions and behaviors as they happen",
      webmeterDetail: "Yes",
      plausibleDetail: "Only real-time traffic count"
    },
    { 
      feature: "Designed for Funnels", 
      webmeter: true, 
      plausible: false, 
      description: "Built from the ground up for funnel optimization",
      webmeterDetail: "Absolutely",
      plausibleDetail: "Not designed for funnels"
    }
  ];

  const whyWebMeter = [
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Funnels Matter for SaaS Growth",
      description: "Plausible gives you traffic stats, but doesn't help you understand how users move through your funnel, where they drop off, and where to fix conversion leaks."
    },
    {
      icon: <Activity className="w-6 h-6 text-green-600" />,
      title: "Event-Level Tracking",
      description: "Want to track button clicks, signup completions, feature usage? WebMeter gives you that without coding 10 custom scripts."
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      title: "Made for SaaS Teams",
      description: "From day one, WebMeter was built for early-stage SaaS teams — not bloggers or content sites."
    }
  ];

  const choiceComparison = [
    {
      title: "Choose WebMeter if:",
      icon: <Check className="w-5 h-5 text-blue-600" />,
      color: "blue",
      items: [
        "You want to track funnels and user journeys",
        "You're a SaaS founder looking to grow conversions", 
        "You care about event-based user behavior",
        "You need detailed conversion optimization insights"
      ]
    },
    {
      title: "Choose Plausible if:",
      icon: <X className="w-5 h-5 text-gray-500" />,
      color: "gray",
      items: [
        "You only want simple pageview stats",
        "You want ultra-minimal analytics",
        "You just want traffic overview",
        "You don't need funnel or conversion tracking"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
     

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Best Funnel Analytics for SaaS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            WebMeter vs Plausible:<br />
            <span className="text-blue-600">Beyond Basic Analytics</span><br />
            to SaaS Funnel Growth
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Looking for a Plausible alternative for SaaS funnels? WebMeter gives you event-based tracking, user journey insights, and funnel analytics in one simple dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
              <span>Start Free on WebMeter</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
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

      {/* Why WebMeter Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why SaaS Founders Choose WebMeter Over Plausible</h2>
            <p className="text-lg text-gray-600">Get beyond basic page views to understand your conversion funnel</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {whyWebMeter.map((reason, index) => (
              <div key={index} className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section id="features" className="py-16 px-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
            <p className="text-lg text-gray-600">See how WebMeter goes beyond Plausible's basic analytics</p>
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
                        <span>WebMeter ✅</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Plausible ❌</th>
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
                              <span className="font-medium text-sm">{row.webmeterDetail}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center space-x-1 text-red-500">
                              <X className="w-5 h-5" />
                              <span className="font-medium text-sm">{row.webmeterDetail}</span>
                            </div>
                          )
                        ) : (
                          <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                            {row.webmeterDetail}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.plausible === 'boolean' ? (
                          row.plausible ? (
                            <div className="inline-flex items-center space-x-1 text-green-600">
                              <Check className="w-5 h-5" />
                              <span className="font-medium text-sm">{row.plausibleDetail}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center space-x-1 text-red-500">
                              <X className="w-5 h-5" />
                              <span className="font-medium text-sm">{row.plausibleDetail}</span>
                            </div>
                          )
                        ) : (
                          <span className="font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {row.plausibleDetail}
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

      {/* When to Choose Section */}
      <section id="comparison" className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Which Tool is Right for You?</h2>
            <p className="text-lg text-gray-600">Choose based on your analytics needs and business goals</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {choiceComparison.map((choice, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${
                choice.color === 'blue' 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  {choice.icon}
                  <h3 className={`text-xl font-semibold ${
                    choice.color === 'blue' ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {choice.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {choice.items.map((item, itemIndex) => (
                    <li key={itemIndex} className={`flex items-start space-x-3 ${
                      choice.color === 'blue' ? 'text-blue-800' : 'text-gray-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        choice.color === 'blue' ? 'bg-blue-600' : 'bg-gray-400'
                      }`}></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What SaaS Teams Are Saying</h2>
            <p className="text-lg text-gray-600">Real feedback from founders who made the switch</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-lg text-gray-600 mb-6 italic leading-relaxed">
              "We switched from Plausible to WebMeter because we needed more insight into user journeys and funnels. Installation was fast, and we started seeing where users drop within 1 day."
            </blockquote>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">SaaS Founder</div>
                <div className="text-sm text-gray-500">Early-stage startup</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">Join hundreds of SaaS teams tracking better conversions with WebMeter</p>
          </div>
        </div>
      </section>

    

      {/* Footer */}
      <CompareFooter />
    </div>
  );
} 