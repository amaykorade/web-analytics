import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Globe,
  Monitor,
  MousePointer2,
  ArrowUpRight,
  Calendar,
  Filter,
  ArrowUpRightFromCircle,
  AlertCircle,
  XCircle,
  GitBranch,
} from "lucide-react";

import dayjs from "dayjs";
import ReferralSources from "./ReferralSources";
import TopPages from "./TopPages";
import DateRangePicker from "./DateRangePicker";
import { useDispatch, useSelector } from "react-redux";
import { getScriptThunk, userData } from "../features/script/scriptSlice";
import {
  analyticsData,
  getAnalyticsThunk,
  clearAnalytics
} from "../features/data/dataSlice";
import Devices from "./Devices";
import Location from "./Location";
import VisitorsRevenueChart from "./VisitorsChart";
import { getCurrentUserthunk } from "../features/user/userSlice";
import { Link } from "react-router-dom";
import { Select } from "antd";

const { Option } = Select;

export default function Dashboard() {
  const dispatch = useDispatch();
  const result = useSelector(analyticsData);
  const scriptData = useSelector(userData);

  const [data, setData] = useState({
    userID: null,
    websiteName: null,
    totalVisitors: 0,
    visitorsChange: 0,
    clickRate: 0,
    conversionRate: 0,
    activeUsers: 0,
    bounceRate: 0,
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState("loading");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [showExpiringSoonMessage, setShowExpiringSoonMessage] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  useEffect(() => {
    setLoading(true);
    dispatch(getCurrentUserthunk())
      .unwrap()
      .then((response) => {
        const status = response?.user?.paymentStatus;
        const endDate = response?.user?.subscriptionEndDate;

        if (endDate) {
          const parsedEnd = dayjs(endDate);
          setSubscriptionEndDate(parsedEnd);

          const daysLeft = parsedEnd.diff(dayjs(), "day");

          const dismissed =
            localStorage.getItem("subscriptionExpiryDismissed") === "true";
          if (daysLeft <= 5 && daysLeft >= 0 && !dismissed) {
            setShowExpiringSoonMessage(true);
          }
        }

        if (status === "active" || status === "trial") {
          setSubscriptionStatus("active");
        } else {
          setSubscriptionStatus("expired");
        }
      })
      .catch(() => {
        setSubscriptionStatus("expired");
      });

    dispatch(getScriptThunk())
      .unwrap()
      .then((response) => {
        const verifiedWebsites = response.scripts.filter(website => website.isVerified);
        console.log('Verified websites:', verifiedWebsites);
        
        // Get the current website from localStorage or use the first verified website
        const currentWebsite = JSON.parse(localStorage.getItem("currentWebsite"));
        const websiteToUse = currentWebsite || verifiedWebsites[0];
        
        if (websiteToUse) {
          setData((prevData) => ({
            ...prevData,
            userID: websiteToUse.userId,
            websiteName: websiteToUse.websiteName,
          }));
          setSelectedWebsite(websiteToUse);
          
          // Clear existing analytics data
          dispatch(clearAnalytics());
          
          // Fetch analytics data for the selected website
          dispatch(getAnalyticsThunk({ 
            userID: websiteToUse.userId, 
            websiteName: websiteToUse.websiteName,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          }));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (result) {
      setData((prevData) => ({
        ...prevData,
        totalVisitors: result.totalVisitors.count || "-",
        clickRate: result.clickRate.rate || "-",
        conversionRate: result.conversionRate.rate || "-",
        activeUsers: result.activeUsers.count || "-",
        bounceRate: result.bounceRate.rate || "-",
      }));
    }
  }, [result]);

  const handleWebsiteChange = (website) => {
    console.log('Changing to website:', website);
    setSelectedWebsite(website);
    setData((prevData) => ({
      ...prevData,
      userID: website.userId,
      websiteName: website.websiteName,
    }));
    localStorage.setItem("currentWebsite", JSON.stringify(website));
    
    // Clear existing analytics data
    dispatch(clearAnalytics());
    
    // Fetch analytics data for the selected website
    dispatch(getAnalyticsThunk({ 
      userID: website.userId, 
      websiteName: website.websiteName,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }));
  };

  const handleDismiss = () => {
    localStorage.setItem("subscriptionExpiryDismissed", "true");
    setShowExpiringSoonMessage(false);
  };

  // Update the date range effect to use the current website
  useEffect(() => {
    if (selectedWebsite) {
      dispatch(getAnalyticsThunk({ 
        userID: selectedWebsite.userId, 
        websiteName: selectedWebsite.websiteName,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }));
    }
  }, [dateRange, selectedWebsite, dispatch]);

  if (loading || subscriptionStatus === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 relative">
        <nav className="bg-white border-b border-gray-200 relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-6">
                <Select
                  value={selectedWebsite?._id}
                  onChange={(value) => {
                    const website = scriptData?.scripts?.find(s => s._id === value);
                    if (website) {
                      handleWebsiteChange(website);
                    }
                  }}
                  style={{ width: 200 }}
                  placeholder="Select Website"
                >
                  {scriptData?.scripts?.filter(website => website.isVerified).map((website) => (
                    <Option key={website._id} value={website._id}>
                      {website.websiteName}
                    </Option>
                  ))}
                </Select>
                <div className="ml-8">
                  <DateRangePicker
                    value={[dayjs(dateRange.startDate), dayjs(dateRange.endDate)]}
                    onChange={(dates) => {
                      if (dates) {
                        setDateRange({
                          startDate: dates[0].toDate(),
                          endDate: dates[1].toDate(),
                        });
                      }
                    }}
                    className="w-72"
                    disabled={subscriptionStatus === "expired"}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  to="/funnel"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  Build Funnel
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {showExpiringSoonMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded z-50 shadow-md flex items-center justify-between w-[90%] md:w-[600px]">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-700" />
              <span>
                Your subscription is ending soon. Please renew to avoid service
                interruption.
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-4 hover:text-yellow-900"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        {subscriptionStatus === "expired" && (
          <div className="absolute inset-0 z-50 flex justify-center items-start pt-10 backdrop-blur-sm bg-white/40">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Subscription Expired
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Your subscription has expired or your tokens have been
                exhausted. Please renew your subscription to continue accessing
                dashboard analytics.
              </p>
              <Link
                to="/billing"
                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-center transition duration-200"
              >
                Go to Billing
              </Link>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 mt-10">
            {/* Total Visitors */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Visitors
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.totalVisitors}
                  </p>
                </div>
              </div>
            </div>
            {/* Click Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <MousePointer2 className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Click Rate
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.clickRate}
                  </p>
                </div>
              </div>
            </div>
            {/* Conversion Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ArrowUpRight className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.conversionRate}
                  </p>
                </div>
              </div>
            </div>
            {/* Bounce Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ArrowUpRightFromCircle className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Bounce Rate
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.bounceRate}
                  </p>
                </div>
              </div>
            </div>
            {/* Active Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Visitors now
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.activeUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <VisitorsRevenueChart />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Top Pages
              </h2>
              <TopPages />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Referral Sources
              </h2>
              <ReferralSources />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <Devices />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Location />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
