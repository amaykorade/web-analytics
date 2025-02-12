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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content:
        "WebAnalytics has transformed how we understand our users. The real-time insights have been invaluable for our decision-making process.",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateLabs",
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content:
        "The level of detail in the analytics is impressive. We can now make data-driven decisions with confidence.",
    },
    {
      name: "Emma Davis",
      role: "E-commerce Director",
      company: "ShopWave",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content:
        "Since implementing WebAnalytics, our conversion rates have improved by 40%. The insights are simply game-changing.",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: 0,
      features: [
        "Up to 10,000 monthly pageviews",
        "Basic analytics dashboard",
        "Real-time visitor count",
        "7-day data retention",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: 29,
      popular: true,
      features: [
        "Up to 100,000 monthly pageviews",
        "Advanced analytics dashboard",
        "Custom event tracking",
        "30-day data retention",
        "Priority support",
        "Custom reports",
        "Multiple website tracking",
      ],
    },
    {
      name: "Enterprise",
      price: 99,
      features: [
        "Unlimited pageviews",
        "Custom solutions",
        "Dedicated account manager",
        "Unlimited data retention",
        "24/7 phone support",
        "API access",
        "Custom integrations",
        "SLA guarantee",
      ],
    },
  ];

  const faqs = [
    {
      question: "How does WebAnalytics protect user privacy?",
      answer:
        "We take privacy seriously. Our analytics platform is GDPR-compliant, doesn't use cookies by default, and anonymizes all user data. We never collect or store personally identifiable information unless explicitly configured to do so.",
    },
    {
      question: "Can I migrate from Google Analytics?",
      answer:
        "Yes! We provide easy migration tools and guides to help you transition from Google Analytics. Our platform can import historical data and provides familiar metrics while offering enhanced privacy features.",
    },
    {
      question: "How accurate is the real-time tracking?",
      answer:
        "Our real-time tracking is highly accurate with updates every second. We use advanced techniques to filter out bots and spam traffic, ensuring you get reliable data about real visitors.",
    },
    {
      question: "Do you offer custom solutions for large enterprises?",
      answer:
        "Absolutely! Our Enterprise plan includes custom solutions, dedicated support, and can be tailored to your specific needs. Contact our sales team to discuss your requirements.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer various levels of support depending on your plan. This ranges from email support for Starter plans to 24/7 phone support and dedicated account managers for Enterprise customers.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-600 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Analytics that respects
              <span className="block text-indigo-200">your users' privacy</span>
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Get powerful insights about your website visitors while
              maintaining their privacy. No cookies required, GDPR-compliant,
              and lightning fast.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
              >
                Start for free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-600 transition-colors"
              >
                View demo
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-500 rounded-full opacity-10"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500 opacity-10"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                10M+
              </div>
              <div className="text-gray-600">Websites Tracked</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">1B+</div>
              <div className="text-gray-600">Monthly Pageviews</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                99.9%
              </div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to understand your visitors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive insights without compromising on privacy or
              performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
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

      {/* Live Demo Section */}
      <div id="demo" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See it in action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience our powerful analytics dashboard with live data.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400">Active Users</div>
                    <Users className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1,234</div>
                  <div className="text-sm text-green-400">
                    +12.3% vs last hour
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400">Page Views</div>
                    <LineChart className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">5,678</div>
                  <div className="text-sm text-green-400">
                    +8.7% vs last hour
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400">Conversion Rate</div>
                    <MousePointer2 className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">3.2%</div>
                  <div className="text-sm text-red-400">-1.4% vs last hour</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="h-64 flex items-center justify-center text-gray-600">
                  [Interactive Chart Demo]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by industry leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about WebAnalytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-indigo-600">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for you. All plans include a 14-day
              free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden
                  ${plan.popular ? "ring-2 ring-indigo-600" : ""}
                `}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 text-sm font-medium">
                    Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold
                      ${
                        plan.popular
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      } transition-colors`}
                  >
                    Get started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-600">
              Have a different question? Contact our support team.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {activeFaq === index ? (
                    <Minus className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-white mb-2">
                Ready to get started?
              </h2>
              <p className="text-indigo-100">
                Join thousands of companies already using WebAnalytics.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
              >
                Start free trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-600 transition-colors"
              >
                View demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
