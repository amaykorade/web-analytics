import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Card } from "antd";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoMercator } from "d3-geo";
import { userData } from "../features/script/scriptSlice";
import { analyticsData, getDeviceThunk } from "../features/data/dataSlice";
import { ArrowUpRight, Monitor } from "lucide-react";

const filterOptions = [
  { value: "browser", label: "Browser" },
  { value: "os", label: "Operating System" },
  { value: "device", label: "Device Type" },
];

export default function Devices() {
  const [filterBy, setFilterBy] = useState("browser");

  // Fetch devices data from Redux store
  const analytics = useSelector(analyticsData);
  const devicesData = analytics?.devices || {};

  // Get selected category data (Browser, OS, or Device)
  const deviceData = devicesData[filterBy] || [];

  // Calculate total users for selected category
  const totalUsers = deviceData.reduce((sum, item) => sum + item.count, 0);

  // Find most popular device
  const mostPopularDevice =
    deviceData.length > 0
      ? deviceData.reduce(
          (max, item) => (item.count > max.count ? item : max),
          deviceData[0]
        )
      : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Device Analytics
        </h3>
        <select
          className="px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-indigo-600 text-sm font-medium">Total Users</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {totalUsers.toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-green-600 text-sm font-medium">Most Popular</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {mostPopularDevice?.name || "N/A"}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-purple-600 text-sm font-medium">
            Market Share
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {mostPopularDevice?.percentage || 0}%
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="space-y-4">
        {deviceData.length > 0 ? (
          deviceData.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Monitor className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.count.toLocaleString()} users
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.percentage}%
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>

      {/* Time Period Note */}
      {/* <div className="mt-6 text-sm text-gray-500 text-center">
        Data shown for the last 30 days
      </div> */}
    </div>
  );
}
