import React from "react";
import { useSelector } from "react-redux";
import { analyticsData } from "../features/data/dataSlice";

export default function TopPages() {
  const analytics = useSelector(analyticsData);
  console.log(analytics);
  const topPages = analytics?.topPages || [];

  // Function to extract the last part of the URL
  const getPathName = (url) => {
    try {
      return new URL(url).pathname;
    } catch (error) {
      return url;
    }
  };

  // Function to format time in MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Page
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
              Views
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
              Avg. Time
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
              Bounce Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {topPages.map((page, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-3 px-4 text-sm text-gray-900">
                {getPathName(page.url)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                {page.views.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                {formatTime(page.avgTimeSpent)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                {page?.bounceRate?.rate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
