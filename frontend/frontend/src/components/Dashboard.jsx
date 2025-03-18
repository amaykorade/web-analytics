import React, { useEffect, useState } from "react";
// import { DatePicker, Select } from 'antd';

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
} from "lucide-react";

import dayjs from "dayjs";

import ReferralSources from "./ReferralSources";
import TopPages from "./TopPages";
import DateRangePicker from "./DateRangePicker";
import { useDispatch, useSelector } from "react-redux";
import { getScriptThunk } from "../features/script/scriptSlice";
import {
  analyticsData,
  getActiveUsersThunk,
  getAnalyticsThunk,
  getClickRateThunk,
  getConversionRateThunk,
  getVisitorsThunk,
} from "../features/data/dataSlice";
import Devices from "./Devices";
import Location from "./Location";
import VisitorsRevenueChart from "./VisitorsChart";

// const {RangePicker} = DatePicker;
// const {Option} = Select;

export default function Dashboard() {
  const dispatch = useDispatch();

  const result = useSelector(analyticsData);

  const [data, setData] = useState({
    userID: null,
    websiteName: null,
    totalVisitors: 0,
    visitorsChange: 0,
    clickRate: 0,
    // weeklyClickRateChange,
    conversionRate: 0,
    activeUsers: 0,
    bounceRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  useEffect(() => {
    setLoading(true);

    dispatch(getScriptThunk())
      .unwrap()
      .then((response) => {
        const scriptData = response.scripts[0];
        setData((prevData) => ({
          ...prevData,
          userID: scriptData?.userId,
          websiteName: scriptData?.websiteName,
        }));
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

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  // if (error) {
  //   return <div>Error: {error}</div>; // Show error message
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
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
              />

              {/* <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button> */}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Visitors
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {" "}
                  {data.totalVisitors}{" "}
                </p>
                {/* <p className="text-sm text-green-600"> +{} </p> */}
              </div>
            </div>
          </div>
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
                <p className="text-sm text-green-600"> {} </p>
              </div>
            </div>
          </div>
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
                {/* <p className="text-sm text-red-600">-0.3% vs last week</p> */}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ArrowUpRightFromCircle className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {" "}
                  {data.bounceRate}{" "}
                </p>
                {/* <p className="text-sm text-green-600">+5.7% vs last week</p> */}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Visitors now
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {" "}
                  {data.activeUsers}{" "}
                </p>
                {/* <p className="text-sm text-green-600">+5.7% vs last week</p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1  gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Visitors Over Time
            </h2> */}
            <VisitorsRevenueChart />
          </div>
          {/* <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Referral Sources
            </h2>
            <ReferralSources />
          </div> */}
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
            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Location & Devices</h2> */}
            <Devices />
          </div>
        </div>
        {/* <div className="grid grid-cols-1  gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Location
            </h2>
            <Location />
          </div>
        </div> */}
        <div className="grid grid-cols-1 mt-10 gap-8 mb-8">
          <Location />
        </div>
      </main>
    </div>
  );
}
