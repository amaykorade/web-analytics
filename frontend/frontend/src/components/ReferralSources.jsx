import React from 'react';

const mockData = [
  { source: 'Google', visitors: 12453, conversion: 2.4 },
  { source: 'Direct', visitors: 8234, conversion: 3.1 },
  { source: 'Facebook', visitors: 4521, conversion: 1.8 },
  { source: 'Twitter', visitors: 2341, conversion: 1.5 },
  { source: 'LinkedIn', visitors: 1234, conversion: 2.9 }
];

export default function ReferralSources() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Source</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Visitors</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Conversion</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-3 px-4 text-sm text-gray-900">{item.source}</td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.visitors.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.conversion}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}