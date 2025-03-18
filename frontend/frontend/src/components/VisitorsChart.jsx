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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const visitorsData = payload.find((item) => item.dataKey === "visitors");
    const revenueData = payload.find((item) => item.dataKey === "revenue");

    return (
      <div
        style={{
          background: "#000",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p>{label}</p>
        {visitorsData && (
          <p style={{ color: "#4A90E2" }}>
            Visitors: {Math.round(visitorsData.value)}
          </p>
        )}
        {revenueData && <p style={{ color: "#eb0e0e" }}>Revenue: $0</p>}
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
    const dateKey = dayjs(time).format("YYYY-MM-DD"); // Group by date
    if (!acc[dateKey]) {
      acc[dateKey] = { time: dateKey, visitors: 0, revenue: 0 };
    }
    acc[dateKey].visitors += visitors; // Sum up visitors per day
    return acc;
  }, {});

  const formattedData = Object.values(groupedData);

  return (
    <div style={{ textAlign: "left", marginTop: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <Button
          type={showVisitors ? "primary" : "default"}
          onClick={() => setShowVisitors(!showVisitors)}
          style={{ marginRight: "10px" }}
        >
          Toggle Visitors
        </Button>
        <Button
          type={showRevenue ? "primary" : "default"}
          onClick={() => setShowRevenue(!showRevenue)}
        >
          Toggle Revenue
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={formattedData}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(tick) => tick} // ✅ Show actual formatted time
            angle={-10} // Slightly tilt for better readability
            height={50}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(value) => Math.round(value)} // ✅ Ensure whole numbers
            allowDecimals={false} // Prevent decimal values
          />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
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
                stroke="#4A90E2"
                strokeWidth={2}
                dot={false}
              />
            </>
          )}
          {showRevenue && (
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="#3949ab"
              barSize={30}
              radius={5}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorsRevenueChart;
