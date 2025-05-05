import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Download, Mail } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const successFlag = sessionStorage.getItem("paymentSuccess");
    if (successFlag) {
      setAllowed(true);
      sessionStorage.removeItem("paymentSuccess"); // Clear so it's one-time
    } else {
      navigate("/dashboard"); // or show a 403 page
    }
  }, [navigate]);

  if (!allowed) return null; // or a loader while checking

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mt-3 text-xl font-semibold text-gray-900">
              Payment Successful!
            </h1>
            <p className="mt-2 text-gray-600">
              Thank you for your payment. Your transaction has been completed
              successfully.
            </p>

            <div className="mt-8 bg-gray-50 rounded-lg p-6 text-left">
              <h2 className="text-sm font-medium text-gray-900">
                Transaction Details
              </h2>
              <dl className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Amount Paid</dt>
                  <dd className="text-sm font-medium text-gray-900">$99.00</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Transaction ID</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    TXN_123456789
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Payment Method</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Visa ending in 4242
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Date</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 space-y-4">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </button>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Mail className="h-4 w-4 mr-2" />
                Email Receipt
              </button>
            </div>

            <div className="mt-6">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
