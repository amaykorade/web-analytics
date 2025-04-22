import React from "react";
import { RotateCcw, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export default function RefundCancellationPage() {
  const lastUpdatedDate = new Date();
  const formattedDate = lastUpdatedDate.toLocaleDateString("en-GB"); // dd-mm-yyyy
  const formattedDateTime = lastUpdatedDate.toLocaleString("en-GB"); // dd-mm-yyyy hh:mm:ss

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with Stats Cards - Similar to your analytics UI */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Cancellation & Refund Policy
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-xl font-semibold">{formattedDate}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <RotateCcw size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Processing Time</div>
              <div className="text-xl font-semibold">9-15 Days</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Report Issues Within</div>
              <div className="text-md font-semibold">15 Days</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Approval Status</div>
              <div className="text-md font-semibold">Case by Case</div>
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <p className="text-gray-600 mb-6">
            AMAY RAMALING KORADE believes in helping its customers as far as
            possible, and has therefore a liberal cancellation policy. Under
            this policy:
          </p>

          <div className="space-y-6">
            <PolicyItem text="Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them." />
            <PolicyItem text="AMAY RAMALING KORADE does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good." />
            <PolicyItem text="In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 15 Days days of receipt of the products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 15 Days days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision." />
            <PolicyItem text="In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them. In case of any Refunds approved by the AMAY RAMALING KORADE, it'll take 9-15 Days days for the refund to be processed to the end customer." />
          </div>

          {/* Process Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProcessCard
              step="1"
              title="Request Submission"
              text="Submit your cancellation request immediately after placing the order"
            />
            <ProcessCard
              step="2"
              title="Review Process"
              text="Our team will review your request based on order status and policy"
            />
            <ProcessCard
              step="3"
              title="Refund Processing"
              text="If approved, refunds will be processed within 9-15 days to your account"
            />
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> All issues with received
                    products must be reported within 15 days of receipt.
                    Requests after this period may not be considered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
          <p>© 2025 AMAY RAMALING KORADE. All rights reserved.</p>
          <p className="mt-2">Last updated on {formattedDateTime}</p>
        </div>
      </div>
    </div>
  );
}

function PolicyItem({ text }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        <div className="h-4 w-4 rounded-full bg-indigo-600"></div>
      </div>
      <p className="ml-3 text-gray-600">{text}</p>
    </div>
  );
}

function ProcessCard({ step, title, text }) {
  return (
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
      <div className="text-indigo-600 mb-3 flex justify-center">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">{step}</span>
        </div>
      </div>
      <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{text}</p>
    </div>
  );
}
