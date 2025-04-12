import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus as PlusIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserthunk } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const monthlyPlans = [
  { plan: "10k", price: 9, events: 10_000 },
  { plan: "100k", price: 19, events: 100_000 },
  { plan: "200k", price: 29, events: 200_000 },
  { plan: "500k", price: 49, events: 500_000 },
  { plan: "1M", price: 69, events: 1_000_000 },
  { plan: "2M", price: 89, events: 2_000_000 },
  { plan: "5M", price: 129, events: 5_000_000 },
  { plan: "10M", price: 169, events: 10_000_000 },
  { plan: "10M+", price: 199, events: Infinity },
];

const yearlyPlans = [
  { plan: "10k", price: 90, events: 10_000, cutPrice: 108 },
  { plan: "100k", price: 190, events: 100_000, cutPrice: 228 },
  { plan: "200k", price: 290, events: 200_000, cutPrice: 348 },
  { plan: "500k", price: 490, events: 500_000, cutPrice: 588 },
  { plan: "1M", price: 690, events: 1_000_000, cutPrice: 828 },
  { plan: "2M", price: 890, events: 2_000_000, cutPrice: 1068 },
  { plan: "5M", price: 1290, events: 5_000_000, cutPrice: 1548 },
  { plan: "10M", price: 1690, events: 10_000_000, cutPrice: 2028 },
  { plan: "10M+", price: 1990, events: Infinity, cutPrice: 2388 },
];

export default function BillingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isYearly, setIsYearly] = useState(true);
  const [email, setEmail] = useState("");

  const [activePlan, setActivePlan] = useState({
    name: "100k",
    isYearly: true,
    expiresAt: "May 15, 2025",
    status: "active",
  });

  const plans = isYearly ? yearlyPlans : monthlyPlans;
  const currentPlan = plans[sliderIndex];

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setSliderIndex(value);
  };

  console.log("currentPlan: ", currentPlan);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    dispatch(getCurrentUserthunk())
      .unwrap()
      .then((response) => {
        console.log("user: ", response);
        // setName(response?.user?.name);
        const user = response?.user;
        setEmail(user?.email);

        if (user) {
          setActivePlan({
            name: user.pricingPlan,
            isYearly: user.isYearly,
            expiresAt: new Date(user.subscriptionEndDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            ),
            status: user.paymentStatus,
          });
        }
      });
  }, [dispatch]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    // if (loading) return;
    // setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, currentPlan, isYearly }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to create order:", data.message);
        alert(data.message || "Something went wrong");
        return;
      }

      const options = {
        key: "rzp_test_nWKipUgyXOws1e", // Replace with your actual Razorpay key
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Webmeter",
        description: "Billing Payment",
        // image: "https://yourcompany.com/logo.png", // optional
        order_id: data.order.id,
        handler: async function (response) {
          const verifyRes = await fetch(
            "http://localhost:3000/api/payment/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email,
                currentPlan,
                isYearly,
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment verified successfully!");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Error creating order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white bg-gray-800 rounded-md px-3 py-2 transition duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-white mb-8">Billing</h1>

        {/* Active Plan */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Current Plan
          </h2>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">
                  {activePlan.name} {activePlan.isYearly ? "Yearly" : "Monthly"}
                </p>
                <p className="text-sm text-gray-400">Active Plan</p>
              </div>
            </div>
            <div className="bg-green-800 bg-opacity-30 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-green-400">
                {activePlan.status === "active" ? "Active" : "Expired"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-700 pt-4">
            <div>
              <p className="text-gray-400 text-sm">Expires on</p>
              <p className="text-white font-medium">{activePlan.expiresAt}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Events Used</p>
              <p className="text-white font-medium">
                {activePlan.eventsUsed || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Slider Section */}
        <div className="mb-10">
          <div className="flex justify-start mb-2">
            <div className="bg-gray-800 px-3 py-1 rounded-md">
              <span className="text-sm font-medium">
                Up to {currentPlan.plan} events
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">
              {plans[0].plan}
            </span>

            <div className="relative w-full mx-4">
              {/* Background track */}
              <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-700 rounded-lg transform -translate-y-1/2 z-0" />

              {/* Active track */}
              <div
                className="absolute top-1/2 left-0 h-2 bg-indigo-600 rounded-lg transform -translate-y-1/2 z-10"
                style={{
                  width: `${(sliderIndex / (plans.length - 1)) * 100}%`,
                }}
              />

              {/* Thumb */}
              <div
                className="absolute top-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(sliderIndex / (plans.length - 1)) * 100}%` }}
              >
                <div className="w-5 h-5 bg-white ring-2 ring-indigo-500 rounded-full shadow-lg"></div>
              </div>

              {/* Actual range input */}
              <input
                type="range"
                min="0"
                max={plans.length - 1}
                value={sliderIndex}
                onChange={handleSliderChange}
                className="relative w-full h-2 bg-transparent appearance-none z-20 cursor-pointer opacity-0"
              />
            </div>

            <span className="text-sm font-medium text-gray-400">
              {plans[plans.length - 1].plan}
            </span>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 mb-10">
          {/* Pricing Toggle */}
          <div className="flex justify-center space-x-2 mb-8">
            <button
              className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                !isYearly
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium flex items-center transition duration-200 ${
                isYearly
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setIsYearly(true)}
            >
              Yearly
              <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                2 months free
              </span>
            </button>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-center mb-8">
            {isYearly && (
              <span className="text-lg line-through text-gray-500 mr-2">
                ${currentPlan.cutPrice}
              </span>
            )}
            <span className="text-4xl font-bold text-white">
              ${currentPlan.price}
            </span>
            <span className="text-gray-400 ml-2">
              /{isYearly ? "year" : "month"}
            </span>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="text-gray-300">
                {currentPlan.plan} monthly{" "}
                <span className="text-indigo-400 border-b border-indigo-400">
                  events
                </span>
              </span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="text-gray-300">Unlimited websites</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="text-gray-300">
                Web analytics, revenue data & KPIs
              </span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="text-gray-300">
                Stripe & Lemon Squeezy integrations
              </span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="text-gray-300">Import your data</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200"
            onClick={handleCreateOrder}
          >
            Pick plan
          </button>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">FAQ</h2>

          <div className="border border-gray-700 rounded-md overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-800 hover:bg-gray-750">
              <span className="font-medium text-gray-300">
                Which plan should I choose?
              </span>
              <PlusIcon className="h-5 w-5 text-indigo-500" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
