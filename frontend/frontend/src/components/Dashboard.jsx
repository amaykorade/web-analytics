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
import { socket } from '../services/dataApi';

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
        // console.log('Verified websites:', verifiedWebsites);
        
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
    // console.log('Changing to website:', website);
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

  useEffect(() => {
    // Listen for real-time analytics updates (no longer increment totalVisitors here)
    const handleRealtimeUpdate = (event) => {
      // Only update if the event is for the selected website
      // No need to update totalVisitors here; rely on backend analytics
      // Optionally, you can trigger a re-fetch of analytics if you want more accurate data
      // dispatch(getAnalyticsThunk({ userID: data.userID, websiteName: data.websiteName, startDate: dateRange.startDate, endDate: dateRange.endDate }));
    };
    socket.on('newTrackingData', handleRealtimeUpdate);
    return () => {
      socket.off('newTrackingData', handleRealtimeUpdate);
    };
  }, [data.websiteName, data.userID, dateRange.startDate, dateRange.endDate, dispatch]);

  useEffect(() => {
    if (data.websiteName) {
      console.log('Joining dashboard room for', data.websiteName);
      socket.emit('joinDashboard', { websiteName: data.websiteName });
    }
  }, [data.websiteName]);

  useEffect(() => {
    const handleActiveUserCount = (event) => {
      console.log('Received activeUserCount', event);
      if (event.websiteName === data.websiteName) {
        setData((prevData) => ({
          ...prevData,
          activeUsers: event.count,
        }));
      }
    };
    socket.on('activeUserCount', handleActiveUserCount);
    return () => {
      socket.off('activeUserCount', handleActiveUserCount);
    };
  }, [data.websiteName]);

  if (loading || subscriptionStatus === "loading") {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-200">Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 relative">
        <nav className="bg-gray-800 border-b border-gray-700 relative z-50">
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
                  className="bg-gray-900 text-gray-100 border border-gray-700 rounded-md dark-select"
                  dropdownStyle={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}
                  popupClassName="dark-select-dropdown"
                  style={{ backgroundColor: '#1f2937', color: '#f3f4f6', borderColor: '#374151' }}
                >
                  {scriptData?.scripts?.map((website) => (
                    <Option key={website._id} value={website._id} className="bg-gray-900 text-gray-100">
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
                    className="w-72 dark-datepicker"
                    disabled={subscriptionStatus === "expired"}
                    popupClassName="dark-datepicker-popup"
                    inputReadOnly
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/funnel"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all transform hover:scale-105"
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  Build Funnel
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {showExpiringSoonMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded z-50 shadow-md flex items-center justify-between w-[90%] md:w-[600px]">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-300" />
              <span>
                Your subscription is ending soon. Please renew to avoid service
                interruption.
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-4 hover:text-yellow-200"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        {subscriptionStatus === "expired" && (
          <div className="absolute inset-0 z-50 flex justify-center items-start pt-10 backdrop-blur-sm bg-gray-900/40">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-4 border border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-4">
                Subscription Expired
              </h2>
              <p className="text-gray-300 text-center mb-6">
                Your subscription has expired or your tokens have been
                exhausted. Please renew your subscription to continue accessing
                dashboard analytics.
              </p>
              <Link
                to="/billing"
                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-md text-center transition-all transform hover:scale-105"
              >
                Go to Billing
              </Link>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 mt-10">
            {/* Total Visitors */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">
                    Total Visitors
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {data.totalVisitors}
                  </p>
                </div>
              </div>
            </div>
            {/* Click Rate */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center">
                <MousePointer2 className="h-8 w-8 text-indigo-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">
                    Avg. Click Rate
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {data.clickRate}
                  </p>
                </div>
              </div>
            </div>
            {/* Conversion Rate */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center">
                <ArrowUpRight className="h-8 w-8 text-indigo-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {data.conversionRate}
                  </p>
                </div>
              </div>
            </div>
            {/* Bounce Rate */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center">
                <ArrowUpRightFromCircle className="h-8 w-8 text-indigo-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">
                    Bounce Rate
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {data.bounceRate}
                  </p>
                </div>
              </div>
            </div>
            {/* Active Users */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-indigo-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">
                    Visitors now
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {data.activeUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <VisitorsRevenueChart />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Top Pages
              </h2>
              <TopPages />
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Referral Sources
              </h2>
              <ReferralSources />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <Devices />
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <Location />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
