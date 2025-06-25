import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Globe,
  Zap,
  Shield,
  Clock,
  Target,
  ChevronRight,
  CheckCircle,
  Plus,
  Minus,
  Star,
  ArrowRight,
  Users,
  LineChart,
  MousePointer2,
  TrendingUp,
  BarChart,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: Globe,
      title: "Real-Time Analytics",
      description:
        "Track visitor behavior as it happens with live updates and instant insights.",
    },
    {
      icon: Shield,
      title: "Privacy-Focused",
      description:
        "GDPR-compliant analytics that respects user privacy while delivering powerful insights.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized performance with minimal impact on your website loading times.",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description:
        "Set and monitor conversion goals to optimize your business objectives.",
    },
    {
      icon: Clock,
      title: "Historical Data",
      description:
        "Access detailed historical data to track long-term trends and patterns.",
    },
    {
      icon: Users,
      title: "User Flow Analysis",
      description:
        "Understand how visitors navigate through your website with detailed path analysis.",
    },
  ];

  const faqs = [
    {
      question: "Why is privacy so important in web analytics?",
      answer:
        "In today's digital landscape, user privacy is paramount. Our platform ensures you get valuable insights without compromising user trust or personal data.",
    },
    {
      question: "How is this different from other analytics platforms?",
      answer:
        "We're building a fundamentally different approach to web analytics. Our platform prioritizes user privacy, performance, and actionable insights from day one.",
    },
    {
      question: "Can I participate in the early testing?",
      answer:
        "Absolutely! We're currently gathering a select group of early adopters to help shape our platform. Sign up for our waitlist to be considered.",
    },
    {
      question: "What kind of support can I expect?",
      answer:
        "As an early participant, you'll receive dedicated support from our core team. We're committed to working closely with our initial users to refine and improve the platform.",
    },
    {
      question: "How secure is my website data?",
      answer:
        "Security is our top priority. We use state-of-the-art encryption and follow the strictest data protection guidelines to ensure your website data remains completely confidential.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Turn Clicks into Customers
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              WebMeter helps SaaS founders track user journeys, build funnels, and grow revenue — without drowning in dashboards.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/websites"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Growing Revenue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                See How It Works
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" />No credit card required</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-400" />14-day free trial</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-yellow-400" />5-minute setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Turn Data Into Dollars
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover exactly what drives your revenue and optimize for growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-indigo-400 mb-4">+27%</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Average Revenue Increase
              </h3>
              <p className="text-gray-300">
                Our customers see significant revenue growth by optimizing their user journey based on real data.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-indigo-400 mb-4">-35%</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Reduced Bounce Rate
              </h3>
              <p className="text-gray-300">
                Identify and fix conversion killers with precise user behavior tracking.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-indigo-400 mb-4">2.4x</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Higher Conversion Rate
              </h3>
              <p className="text-gray-300">
                Make data-driven decisions that turn visitors into paying customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Revenue-Boosting Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to optimize your website for maximum revenue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <feature.icon className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Demo Section */}
      <div id="demo" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              See Your Growth in Real-Time
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Watch your revenue grow with our powerful analytics dashboard. Every metric is designed to help you make better business decisions.
            </p>
          </div>

          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 right-0 w-72 h-72 bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Dashboard Preview */}
            <div className="relative bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center space-x-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm text-gray-400">Analytics Dashboard</div>
              </div>
              <div className="relative">
                <img 
                  src="/dashboard-image-2.png" 
                  alt="Analytics Dashboard" 
                  className="w-full h-auto rounded-b-xl"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-white">Real-Time Metrics</h3>
                </div>
                <p className="text-gray-300">Track visitor behavior and conversion rates as they happen, with instant updates.</p>
              </div>

              <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center">
                    <MousePointer2 className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-white">User Journey Maps</h3>
                </div>
                <p className="text-gray-300">Visualize how users navigate your site and identify optimization opportunities.</p>
              </div>

              <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-white">Conversion Funnels</h3>
                </div>
                <p className="text-gray-300">Track and optimize your conversion funnels to maximize revenue.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See how businesses like yours are growing revenue with our analytics platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-900 flex items-center justify-center">
                  <span className="text-indigo-400 font-bold text-xl">E</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">
                    E-commerce Store
                  </div>
                  <div className="text-sm text-indigo-400">
                    +45% Revenue
                  </div>
                </div>
              </div>
              <p className="text-gray-300">
                "By tracking user behavior, we identified and fixed our checkout process, leading to a 45% increase in revenue within 3 months."
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-900 flex items-center justify-center">
                  <span className="text-indigo-400 font-bold text-xl">S</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">
                    SaaS Platform
                  </div>
                  <div className="text-sm text-indigo-400">
                    +60% Conversions
                  </div>
                </div>
              </div>
              <p className="text-gray-300">
                "The funnel analytics helped us optimize our onboarding process, resulting in a 60% increase in trial-to-paid conversions."
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-900 flex items-center justify-center">
                  <span className="text-indigo-400 font-bold text-xl">B</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">
                    Blog Network
                  </div>
                  <div className="text-sm text-indigo-400">
                    +80% Engagement
                  </div>
                </div>
              </div>
              <p className="text-gray-300">
                "Understanding user behavior helped us optimize our content strategy, leading to an 80% increase in user engagement."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Three simple steps to start growing your revenue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-indigo-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Install Tracking
              </h3>
              <p className="text-gray-300">
                Add our lightweight tracking code to your website in minutes. No complex setup required.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-indigo-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Collect Data
              </h3>
              <p className="text-gray-300">
                Start gathering real-time insights about your visitors' behavior and journey.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-indigo-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Optimize & Grow
              </h3>
              <p className="text-gray-300">
                Use data-driven insights to optimize your website and watch your revenue grow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Learn more about our upcoming analytics platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <span className="font-medium text-white">
                    {faq.question}
                  </span>
                  {activeFaq === index ? (
                    <Minus className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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
              <a
                href="#demo"
                className="border-2 border-white/50 hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>View Demo</span>
              </a>
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
                <li><a href="#demo" className="text-base text-gray-300 hover:text-white">Demo</a></li>
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
