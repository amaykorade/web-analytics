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
        "Our early testing shows incredible potential. The privacy-first approach is exactly what modern businesses need.",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateLabs",
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content:
        "The level of detail and commitment to user privacy is truly impressive. This is a game-changer for web analytics.",
    },
    {
      name: "Emma Davis",
      role: "E-commerce Strategist",
      company: "ShopWave",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content:
        "We're excited about the potential of this platform. The focus on ethical data collection is exactly what we've been looking for.",
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-600 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Analytics that respects
              <span className="block text-indigo-200">
                Privacy. Performance. Insights.
              </span>
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
                Early access
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-600 transition-colors"
              >
                Learn More
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

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Commitment to Ethical Analytics
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building a platform that respects users while providing
              meaningful insights for businesses.
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
              Early Access Preview
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're currently developing and refining our platform. Join our
              early access program to help shape the future of web analytics.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Coming Soon
              </h3>
              <p className="text-indigo-100 max-w-xl mx-auto">
                Our comprehensive analytics dashboard is currently in
                development. Early access participants will get exclusive first
                look and the opportunity to provide direct feedback to our
                development team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Early Adopter Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from innovative companies excited about our privacy-first
              approach.
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

      {/* FAQ Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Learn more about our upcoming analytics platform.
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
                Be Part of Our Journey
              </h2>
              <p className="text-indigo-100">
                Join our early access program and help shape the future of
                ethical web analytics.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
              >
                Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-600 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
