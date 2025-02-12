import React, { useEffect } from "react";
import { useState } from "react";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getAnalyticsThunk } from "../features/data/dataSlice";
import { getScriptThunk, userData } from "../features/script/scriptSlice";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DateRangePicker = () => {
  const dispatch = useDispatch();
  const [selectedRange, setSelectedRange] = useState("Last 24 Hours");
  const [customRange, setCustomRange] = useState([dayjs(), dayjs()]);

  // User script data
  const scriptData = useSelector(userData);
  const userID = scriptData?.scripts?.[0]?.userId || "";
  const websiteName = scriptData?.scripts?.[0]?.websiteName || "";

  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange]);

  const fetchAnalytics = (range) => {
    let startDate, endDate;

    switch (range) {
      case "Today":
        startDate = endDate = dayjs();
        break;
      case "Last 24 Hours":
        startDate = dayjs().subtract(24, "hours");
        endDate = dayjs();
        break;
      case "Last 7 Days":
        startDate = dayjs().subtract(7, "day");
        endDate = dayjs();
        break;
      case "Last 30 Days":
        startDate = dayjs().subtract(30, "day");
        endDate = dayjs();
        break;
      case "Last 12 Months":
        startDate = dayjs().subtract(12, "months");
        endDate = dayjs();
        break;
      case "All Time":
        startDate = dayjs("2000-01-01"); // Adjust based on your database records
        endDate = dayjs();
        break;
      case "Custom":
        [startDate, endDate] = customRange;
        break;
      default:
        startDate = endDate = dayjs();
    }

    dispatch(
      getAnalyticsThunk({
        userID,
        websiteName,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      })
    );
  };

  return (
    <div>
      <Select
        value={selectedRange}
        onChange={(value) => setSelectedRange(value)}
        style={{ width: 200, marginRight: 10 }}
      >
        <Option value="Today">Today</Option>
        <Option value="Last 24 Hours">Last 24 Hours</Option>
        <Option value="Last 7 Days">Last 7 Days</Option>
        <Option value="Last 30 Days">Last 30 Days</Option>
        <Option value="Last 12 Months">Last 12 Months</Option>
        <Option value="All Time">All Time</Option>
        <Option value="Custom">Custom Range</Option>
      </Select>

      {selectedRange === "Custom" && (
        <RangePicker
          value={customRange}
          onChange={(dates) => {
            setCustomRange(dates);
            fetchAnalytics("Custom");
          }}
        />
      )}
    </div>
  );
};

export default DateRangePicker;
