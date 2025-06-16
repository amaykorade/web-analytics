import React from 'react';
import { useSelector } from 'react-redux';
import { analyticsData } from '../features/data/dataSlice';
import { Tooltip } from 'antd';

const ReferralSources = () => {
    const analytics = useSelector(analyticsData);
    const referralStats = analytics?.referralStats || [];

    const calculateConversionRate = (conversions, visitors) => {
        if (!visitors) return '0.00%';
        return ((conversions / visitors) * 100).toFixed(2) + '%';
    };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Source
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Visitors
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Visits
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Conv.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Conv. Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {referralStats.length > 0 ? (
              referralStats.map((source, index) => (
                <tr key={index} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {source.referrer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {source.visitors}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {source.visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Tooltip title={`${source.conversions} Conversions`}>
                      <span>{source.conversions}</span>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Tooltip title={`${calculateConversionRate(source.conversions, source.visitors)} Conversion Rate`}>
                      <span>{calculateConversionRate(source.conversions, source.visitors)}</span>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                  No referral data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralSources;