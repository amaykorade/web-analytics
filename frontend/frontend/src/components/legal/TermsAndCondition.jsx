import React from "react";
import { Users, FileText, AlertCircle, Shield, Scale } from "lucide-react";

export default function TermsAndConditions() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = currentDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with Stats Cards */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Terms & Conditions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <Users size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-xl font-semibold">{formattedDate}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Legal Document</div>
              <div className="text-xl font-semibold">Terms & Conditions</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <Shield size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Protects</div>
              <div className="text-md font-semibold">Your Rights & Ours</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="mr-4 text-indigo-600">
              <Scale size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Jurisdiction</div>
              <div className="text-md font-semibold">Pune, Maharashtra</div>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              These Terms and Conditions, along with privacy policy or other
              terms ("Terms") constitute a binding agreement by and between AMAY
              RAMALING KORADE, ("Website Owner" or "we" or "us" or "our") and
              you ("you" or "your") and relate to your use of our website, goods
              (as applicable) or services (as applicable) (collectively,
              "Services"). By using our website and availing the Services, you
              agree that you have read and accepted these Terms (including the
              Privacy Policy). We reserve the right to modify these Terms at any
              time and without assigning any reason. It is your responsibility
              to periodically review these Terms to stay informed of updates.
              The use of this website or availing of our Services is subject to
              the following terms of use:
            </p>

            <ul className="list-disc pl-6 space-y-4 text-gray-600">
              <li>
                To access and use the Services, you agree to provide true,
                accurate and complete information to us during and after
                registration, and you shall be responsible for all acts done
                through the use of your registered account.
              </li>

              <li>
                Neither we nor any third parties provide any warranty or
                guarantee as to the accuracy, timeliness, performance,
                completeness or suitability of the information and materials
                offered on this website or through the Services, for any
                specific purpose. You acknowledge that such information and
                materials may contain inaccuracies or errors and we expressly
                exclude liability for any such inaccuracies or errors to the
                fullest extent permitted by law.
              </li>

              <li>
                Your use of our Services and the website is solely at your own
                risk and discretion. You are required to independently assess
                and ensure that the Services meet your requirements.
              </li>

              <li>
                The contents of the Website and the Services are proprietary to
                Us and you will not have any authority to claim any intellectual
                property rights, title, or interest in its contents.
              </li>

              <li>
                You acknowledge that unauthorized use of the Website or the
                Services may lead to action against you as per these Terms or
                applicable laws.
              </li>

              <li>
                You agree to pay us the charges associated with availing the
                Services.
              </li>

              <li>
                You agree not to use the website and/ or Services for any
                purpose that is unlawful, illegal or forbidden by these Terms,
                or Indian or local laws that might apply to you.
              </li>

              <li>
                You agree and acknowledge that website and the Services may
                contain links to other third party websites. On accessing these
                links, you will be governed by the terms of use, privacy policy
                and such other policies of such third party websites.
              </li>

              <li>
                You understand that upon initiating a transaction for availing
                the Services you are entering into a legally binding and
                enforceable contract with the us for the Services.
              </li>

              <li>
                You shall be entitled to claim a refund of the payment made by
                you in case we are not able to provide the Service. The
                timelines for such return and refund will be according to the
                specific Service you have availed or within the time period
                provided in our policies (as applicable). In case you do not
                raise a refund claim within the stipulated time, than this would
                make you ineligible for a refund.
              </li>

              <li>
                Notwithstanding anything contained in these Terms, the parties
                shall not be liable for any failure to perform an obligation
                under these Terms if performance is prevented or delayed by a
                force majeure event.
              </li>

              <li>
                These Terms and any dispute or claim relating to it, or its
                enforceability, shall be governed by and construed in accordance
                with the laws of India.
              </li>

              <li>
                All disputes arising out of or in connection with these Terms
                shall be subject to the exclusive jurisdiction of the courts in
                Pune, Maharashtra.
              </li>

              <li>
                All concerns or communications relating to these Terms must be
                communicated to us using the contact information provided on
                this website.
              </li>
            </ul>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    If you have any questions about these Terms and Conditions,
                    please contact us using the information provided on our
                    Contact page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
          <p>© 2025 AMAY RAMALING KORADE. All rights reserved.</p>
          <p className="mt-2">
            Last updated on {formattedDate} {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
}
