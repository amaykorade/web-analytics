import { Button } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  Legend,
  Area,
} from "recharts";
import { analyticsData } from "../features/data/dataSlice";
import dayjs from "dayjs";
import { Users, TrendingUp } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const visitorsData = payload.find((item) => item.dataKey === "visitors");
    const revenueData = payload.find((item) => item.dataKey === "revenue");

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{dayjs(label).format("MMM D, YYYY")}</p>
        {visitorsData && (
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
            <p className="text-sm font-medium text-gray-900">
              Visitors: {Math.round(visitorsData.value).toLocaleString()}
            </p>
          </div>
        )}
        {revenueData && (
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            <p className="text-sm font-medium text-gray-900">
              Revenue: ${revenueData.value.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const VisitorsRevenueChart = () => {
  const [showVisitors, setShowVisitors] = useState(true);
  const [showRevenue, setShowRevenue] = useState(true);

  const analytics = useSelector(analyticsData);
  const heatmapData = analytics?.heatmapData || [];

  const groupedData = heatmapData.reduce((acc, { time, visitors }) => {
    const dateKey = dayjs(time).format("YYYY-MM-DD");
    if (!acc[dateKey]) {
      acc[dateKey] = { time: dateKey, visitors: 0, revenue: 0 };
    }
    acc[dateKey].visitors += visitors;
    return acc;
  }, {});

  const formattedData = Object.values(groupedData);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Visitor Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Track your website's visitor trends</p>
        </div>
        <div className="flex space-x-2">
          <Button
            type={showVisitors ? "primary" : "default"}
            onClick={() => setShowVisitors(!showVisitors)}
            icon={<Users className="w-4 h-4 mr-1" />}
          >
            Visitors
          </Button>
          <Button
            type={showRevenue ? "primary" : "default"}
            onClick={() => setShowRevenue(!showRevenue)}
            icon={<TrendingUp className="w-4 h-4 mr-1" />}
          >
            Revenue
          </Button>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tickFormatter={(tick) => dayjs(tick).format("MMM D")}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => Math.round(value).toLocaleString()}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              content={({ payload }) => (
                <div className="flex justify-end space-x-4">
                  {payload?.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-600">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            {showVisitors && (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="visitors"
                  stroke="none"
                  fill="url(#colorVisitors)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="visitors"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                  name="Visitors"
                />
              </>
            )}
            {showRevenue && (
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#10B981"
                barSize={20}
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitorsRevenueChart;
