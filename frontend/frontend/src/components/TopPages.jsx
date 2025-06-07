import React from "react";
import { ArrowUp, ArrowDown, Clock, Eye, MousePointer } from "lucide-react";
import { useSelector } from "react-redux";
import { analyticsData } from "../features/data/dataSlice";

export default function TopPages() {
  const analytics = useSelector(analyticsData);
  const topPages = analytics?.topPages || [];

  const formatUrl = (url) => {
    try {
      // If it's a full URL, extract the pathname
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        return urlObj.pathname;
      }
      // If it's already a pathname, return as is
      return url;
    } catch (error) {
      // If URL parsing fails, return the original URL
      return url;
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Time
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bounce Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topPages.map((page, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatUrl(page.url)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {page.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {page.avgTimeSpent ? `${page.avgTimeSpent}s` : '0s'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {page.bounceRate}
                </td>
              </tr>
            ))}
            {topPages.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No page data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
