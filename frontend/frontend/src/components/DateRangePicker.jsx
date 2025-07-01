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
  const [selectedRange, setSelectedRange] = useState("Today");
  const [customRange, setCustomRange] = useState([dayjs(), dayjs()]);

  // Get the current website from localStorage
  const currentWebsite = JSON.parse(localStorage.getItem("currentWebsite"));
  const userID = currentWebsite?.userId || "";
  const websiteName = currentWebsite?.websiteName || "";

  useEffect(() => {
    if (userID && websiteName) {
      fetchAnalytics(selectedRange);
    }
  }, [userID, websiteName]);

  useEffect(() => {
    if (userID && websiteName) {
      fetchAnalytics(selectedRange);
    }
  }, [selectedRange, userID, websiteName, customRange]);

  const fetchAnalytics = (range) => {
    let startDate, endDate;

    switch (range) {
      case "Today":
        startDate = dayjs().startOf("day");
        endDate = dayjs();
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
    <div className="flex items-center space-x-4">
      <Select
        value={selectedRange}
        onChange={(value) => {
          setSelectedRange(value);
          if (value === "Custom") {
            // Handle custom range selection
          }
        }}
        style={{ 
          width: 120,
          backgroundColor: '#1F2937',
          borderColor: '#374151',
          color: '#E5E7EB'
        }}
        className="dark-select"
        dropdownStyle={{ 
          backgroundColor: '#1F2937',
          borderColor: '#374151'
        }}
      >
        <Option value="Today" className="text-gray-200 hover:bg-gray-700">Today</Option>
        <Option value="Last 24 Hours" className="text-gray-200 hover:bg-gray-700">Last 24 Hours</Option>
        <Option value="Last 7 Days" className="text-gray-200 hover:bg-gray-700">Last 7 Days</Option>
        <Option value="Last 30 Days" className="text-gray-200 hover:bg-gray-700">Last 30 Days</Option>
        <Option value="Last 12 Months" className="text-gray-200 hover:bg-gray-700">Last 12 Months</Option>
        <Option value="All Time" className="text-gray-200 hover:bg-gray-700">All Time</Option>
        <Option value="Custom" className="text-gray-200 hover:bg-gray-700">Custom</Option>
      </Select>

      {selectedRange === "Custom" && (
        <RangePicker
          value={customRange}
          onChange={(dates) => {
            if (dates) {
              setCustomRange(dates);
              setSelectedRange("Custom");
            }
          }}
          style={{ 
            width: 240,
            backgroundColor: '#1F2937',
            borderColor: '#374151',
            color: '#E5E7EB'
          }}
          className="dark-datepicker"
          popupClassName="dark-datepicker-popup"
          inputReadOnly
        />
      )}
    </div>
  );
};

export default DateRangePicker;
