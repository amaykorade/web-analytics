import React from "react";
import { ArrowUp, ArrowDown, Clock, Eye, MousePointer } from "lucide-react";
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 3600 / 60);
    const remainingSeconds = Math.round(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
    } else {
      return `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
    }
  };

  // Function to determine bounce rate status
  const getBounceRateStatus = (rate) => {
    if (rate <= 30) return "good";
    if (rate <= 50) return "average";
    return "poor";
  };

  return (
    <div className="">
      {/* Header Section */}
      {/* <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Top Pages</h2>
          <p className="text-sm text-gray-500 mt-1">
            Performance metrics for your most visited pages
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:border-gray-300 transition-colors">
            Export
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:border-gray-300 transition-colors">
            Filter
          </button>
        </div>
      </div> */}

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockData
                  .reduce((sum, page) => sum + page.views, 0)
                  .toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-500 opacity-75" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">
                Avg. Time on Page
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(
                  mockData.reduce((sum, page) => sum + page.avgTimeSpent, 0) /
                    mockData.length
                )}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-500 opacity-75" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Avg. Bounce Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  mockData.reduce(
                    (sum, page) => sum + page.bounceRate.rate,
                    0
                  ) / mockData.length
                )}
                %
              </p>
            </div>
            <MousePointer className="h-8 w-8 text-purple-500 opacity-75" />
          </div>
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 rounded-l-lg">
                Page
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                Views
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                Avg. Time
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 rounded-r-lg">
                Bounce Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {topPages.map((page, index) => {
              const bounceRateStatus = getBounceRateStatus(page?.bounceRate);
              const isLast = index === topPages.length - 1;

              return (
                <tr
                  key={index}
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${isLast ? "" : "border-b border-gray-100"}
                  `}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getPathName(page.url)}
                        </div>
                        <div className="text-xs text-gray-500">{page.url}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 text-right">
                    <div className="font-medium">
                      {page.views.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600">+12.3%</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 text-right">
                    <div className="font-medium">
                      {formatTime(page.avgTimeSpent)}
                    </div>
                    <div className="text-xs text-gray-500">per session</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-right">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        bounceRateStatus === "good"
                          ? "bg-green-100 text-green-800"
                          : bounceRateStatus === "average"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {page.bounceRate}
                      {bounceRateStatus === "good" ? (
                        <ArrowDown className="w-3 h-3 ml-1 text-green-600" />
                      ) : (
                        <ArrowUp className="w-3 h-3 ml-1 text-red-600" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Showing top {topPages.length} pages • Last 30 days
      </div>
    </div>
  );
}
