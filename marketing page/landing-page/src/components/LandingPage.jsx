import React, { useState } from "react";
import {
  BarChart3,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  MousePointer2,
  Users,
  Clock,
  LineChart,
  Target,
  Layers,
  Smartphone,
  Laptop,
  Lock,
} from "lucide-react";

const AIRTABLE_API_KEY =
  "pat7nmpGglqaaHa9U.0b51aba5618af9cb1611be9e56d66424f94a6ee30b079dd11d455305e4f0e6a2";
const BASE_ID = "appDL1XnYOjuKpfiG";
const TABLE_NAME = "Emails";

const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

export default function ProductValidation() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      const checkResponse = await fetch(
        `${API_URL}?filterByFormula=${encodeURIComponent(
          `{Email}="${email}"`
        )}`,

        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const checkData = await checkResponse.json();
      console.log("Airtable Response:", checkData); // Debugging step

      if (!checkResponse.ok) {
        console.error("Airtable API Error:", checkData.error?.message);
        setError(`Airtable Error: ${checkData.error?.message}`);
        return;
      }

      if (!checkData.records) {
        console.error("Unexpected response format:", checkData);
        throw new Error("Unexpected response from Airtable");
      }
      if (checkData.records.length > 0) {
        setError("This email is already subscribed.");
        return;
      }

      const addResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [{ fields: { Email: email } }],
        }),
      });

      if (!addResponse.ok) {
        throw new Error("Failed to add email to Airtable");
      }

      setSubmitted(true);
      setError("");
      setEmail("");
    } catch (err) {
      console.error("Error Details:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Privacy-First Analytics",
      description:
        "Track user behavior without compromising privacy. GDPR and CCPA compliant out of the box.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Zero impact on your website performance with our lightweight tracking script (<2KB).",
    },
    {
      icon: Globe,
      title: "Real-Time Insights",
      description:
        "See who is on your site and what they're doing as it happens with live updates every second.",
    },
    {
      icon: MousePointer2,
      title: "Conversion Tracking",
      description:
        "Track goals and conversions with powerful funnel visualization and drop-off analysis.",
    },
    {
      icon: Users,
      title: "Visitor Insights",
      description:
        "Understand your audience with detailed demographic and behavioral data without collecting PII.",
    },
    {
      icon: Clock,
      title: "Historical Data",
      description:
        "Access unlimited historical data to track long-term trends and seasonal patterns.",
    },
  ];

  const advancedFeatures = [
    {
      icon: LineChart,
      title: "Advanced Reporting",
      description:
        "Create custom reports and dashboards tailored to your specific business needs and KPIs.",
    },
    {
      icon: Target,
      title: "Event Tracking",
      description:
        "Track specific user interactions like button clicks, form submissions, and video plays.",
    },
    {
      icon: Layers,
      title: "Segmentation",
      description:
        "Slice and dice your data with powerful segmentation tools to uncover hidden insights.",
    },
    {
      icon: Smartphone,
      title: "Cross-Device Tracking",
      description:
        "Follow user journeys across multiple devices without compromising privacy.",
    },
    {
      icon: Laptop,
      title: "Heatmaps & Recordings",
      description:
        "See exactly how users interact with your site through visual heatmaps and session recordings.",
    },
    {
      icon: Lock,
      title: "Data Ownership",
      description:
        "You own your data. Export it anytime or connect to your favorite BI tools via our API.",
    },
  ];

  const metrics = [
    { label: "Websites Using Our Platform", value: "10,000+" },
    { label: "Monthly Pageviews Tracked", value: "1B+" },
    { label: "Data Points Analyzed", value: "500M+" },
    { label: "Average Speed Impact", value: "<0.2s" },
  ];

  const useCases = [
    {
      title: "E-commerce",
      description:
        "Track product views, cart additions, and checkout conversions to optimize your sales funnel.",
      stats: "Average 32% increase in conversion rates",
    },
    {
      title: "SaaS",
      description:
        "Monitor user onboarding, feature adoption, and subscription metrics to reduce churn.",
      stats: "Average 28% improvement in user retention",
    },
    {
      title: "Media & Publishing",
      description:
        "Analyze content performance, reader engagement, and subscription conversions.",
      stats: "Average 45% increase in reader engagement",
    },
    {
      title: "Lead Generation",
      description:
        "Track form submissions, content downloads, and lead quality metrics.",
      stats: "Average 37% increase in qualified leads",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <BarChart3 className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Analytics that respects
            <span className="block text-indigo-600">your users' privacy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get powerful insights about your website visitors while maintaining
            their privacy. No cookies required, GDPR-compliant, and lightning
            fast.
          </p>

          {/* Early Access Form */}
          <div className="max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early access"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <p className="ml-3 text-green-800">
                    Thanks! We'll notify you when we launch.
                  </p>
                </div>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Join 10,000+ companies already on the waitlist
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Powerful analytics at your fingertips
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get a comprehensive view of your website performance with our
              intuitive dashboard
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Dashboard Frame */}
            <div className="bg-gray-800 rounded-t-lg p-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-gray-800 p-6 rounded-b-lg shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-300 text-sm">Active Visitors</div>
                    <Users className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1,234</div>
                  <div className="text-sm text-green-400 flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                    +12.3% vs last hour
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-300 text-sm">Bounce Rate</div>
                    <MousePointer2 className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">32.5%</div>
                  <div className="text-sm text-red-400 flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1 rotate-135" />
                    +2.1% vs last hour
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-300 text-sm">Avg. Session</div>
                    <Clock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">3:42</div>
                  <div className="text-sm text-green-400 flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                    +0:18 vs last hour
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white font-medium">
                    Visitors Over Time
                  </div>
                  <div className="text-gray-400 text-sm">Last 24 hours</div>
                </div>
                <div className="h-64 relative">
                  {/* Chart Visualization */}
                  <div className="absolute inset-0 flex items-end">
                    {Array.from({ length: 24 }).map((_, i) => {
                      const height = 30 + Math.random() * 70;
                      return (
                        <div key={i} className="flex-1 flex items-end mx-px">
                          <div
                            className="w-full bg-indigo-500 rounded-t opacity-80"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-700 opacity-20"></div>

                  {/* Chart Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-t border-gray-600 w-full h-0"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Pages */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white font-medium">Top Pages</div>
                    <div className="text-indigo-400 text-sm">View all</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { path: "/", views: 5432, rate: 28 },
                      { path: "/products", views: 3211, rate: 32 },
                      { path: "/about", views: 1432, rate: 45 },
                    ].map((page, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="text-gray-300">{page.path}</div>
                        <div className="flex items-center space-x-4">
                          <div className="text-gray-300">
                            {page.views.toLocaleString()}
                          </div>
                          <div
                            className={`${
                              page.rate < 30
                                ? "text-green-400"
                                : page.rate < 40
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {page.rate}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Devices */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white font-medium">Devices</div>
                    <div className="text-indigo-400 text-sm">View all</div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Desktop", percentage: 65 },
                      { name: "Mobile", percentage: 28 },
                      { name: "Tablet", percentage: 7 },
                    ].map((device, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>{device.name}</span>
                          <span>{device.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to understand your visitors
            </h2>
            <p className="text-xl text-gray-600">
              Get comprehensive insights without compromising on privacy or
              performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Setting up WebAnalytics is simple and takes less than 5 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Add a simple script",
                description:
                  "Copy and paste our lightweight tracking script to your website. No coding skills required.",
              },
              {
                step: "02",
                title: "Collect data instantly",
                description:
                  "Start collecting visitor data immediately. Our script is optimized for performance and privacy.",
              },
              {
                step: "03",
                title: "Gain valuable insights",
                description:
                  "Access your real-time dashboard to see how visitors interact with your website.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-lg h-full">
                  <div className="absolute -top-5 -left-5 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features for data-driven teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Use Cases</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How different industries benefit from our analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-indigo-50 rounded-lg p-3 text-indigo-700 font-medium">
                  {useCase.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by industry leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our beta users are saying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The privacy-first approach has been a game-changer for our GDPR compliance. We've been able to gather valuable insights without compromising user trust.",
                author: "Sarah Johnson",
                role: "CTO at TechCorp",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                quote:
                  "Finally, analytics that don't slow down our website. The insights are invaluable, and our page load times remain lightning fast. The real-time dashboard is addictive!",
                author: "Michael Chen",
                role: "Head of Growth at StartupX",
                image:
                  "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                quote:
                  "The real-time insights have helped us improve conversion rates by 40%. We can now make data-driven decisions instantly rather than waiting for reports.",
                author: "Emma Davis",
                role: "Marketing Director at E-Shop",
                image:
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join the waitlist today and be the first to know when we launch.
            Early access members will receive exclusive benefits and priority
            support.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Join Waitlist
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white/10 text-white p-4 rounded-lg inline-block">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6" />
                <p className="ml-3">Thanks! We'll notify you when we launch.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
