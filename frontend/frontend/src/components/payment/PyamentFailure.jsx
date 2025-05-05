import React from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowRight, RefreshCw, HelpCircle } from "lucide-react";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">
              Payment Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We couldn’t process your payment. Please try again or choose
              another method.
            </p>
          </div>

          {/* Error Details */}
          <div className="mt-6 bg-red-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-red-800">Error Details</h3>
            <p className="mt-2 text-sm text-red-700">
              Error Code: <strong>ERR_PAYMENT_DECLINED</strong>
              <br />
              Your card was declined. Please check your card details or contact
              your bank.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-4">
            <Link
              to="/checkout"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Link>

            <a
              href="mailto:support@example.com"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Contact Support
            </a>
          </div>

          {/* Alternative Payment Options */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Try a different payment method
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  alt: "Visa",
                  src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?&w=100&q=80",
                },
                {
                  alt: "Mastercard",
                  src: "https://images.unsplash.com/photo-1556742111-a301076d9d18?&w=100&q=80",
                },
                {
                  alt: "PayPal",
                  src: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?&w=100&q=80",
                },
              ].map(({ alt, src }) => (
                <div
                  key={alt}
                  className="border-2 border-gray-300 rounded-md flex justify-center items-center h-12 cursor-pointer hover:border-indigo-500 transition"
                >
                  <img src={src} alt={alt} className="h-6" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Link */}
          <div className="mt-6 text-center">
            <Link
              to="/checkout"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Return to Checkout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Support Footer */}
        <div className="text-center text-sm text-gray-600">
          Having trouble?{" "}
          <a
            href="/faq"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            View FAQs
          </a>
        </div>
      </div>
    </div>
  );
}
