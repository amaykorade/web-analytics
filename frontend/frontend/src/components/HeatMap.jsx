import React from "react";
import { useSelector } from "react-redux";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { analyticsData } from "../features/data/dataSlice";

export default function HeatMap() {
  const analytics = useSelector(analyticsData);
  //   console.log("analyticsData:", analytics?.heatmapData);

  const data = analytics?.heatmapData || [];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        {/* X and Y axes */}
        <XAxis
          dataKey="time"
          tick={{ fill: "#000", fontSize: 12 }}
          axisLine={{ stroke: "rgba(0, 0, 0, 0.2)" }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "#000", fontSize: 12 }}
          axisLine={{ stroke: "rgba(0, 0, 0, 0.2)" }}
          tickFormatter={(tick) => Math.round(tick)}
        />
        {/* <YAxis yAxisId="right" orientation="right" /> */}

        {/* Tooltip and Legend */}
        <Tooltip />
        {/* <Legend /> */}

        {/* Bar for Revenue (right axis) */}
        {/* <Bar dataKey="revenue" barSize={30} fill="#5a67d8" yAxisId="right" /> */}

        {/* Area for faint blue fill */}
        <Area
          type="monotone"
          dataKey="visitors"
          stroke="none"
          fill="#5a67d8"
          fillOpacity={0.03}
          yAxisId="left"
        />

        {/* Line for Visitors (left axis) */}
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="#5a67d8"
          strokeWidth={3}
          yAxisId="left"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
