import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { userData } from "../features/script/scriptSlice";
import { analyticsData } from "../features/data/dataSlice";

// Browser logos
const browserLogos = {
  chrome: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg",
  firefox: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg",
  safari: "https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg",
  edge: "https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg",
  opera: "https://upload.wikimedia.org/wikipedia/commons/4/49/Opera_2015_icon.svg",
  default: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Internet_Explorer_10%2B11_logo.svg"
};

// OS logos
const osLogos = {
  windows: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_%282012%E2%80%932017%29.svg",
  macos: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Apple_logo_black.svg",
  ios: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Apple_logo_black.svg",
  android: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Android_logo_2019.svg",
  linux: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
  default: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Apple_logo_black.svg"
};

// Device type logos
const deviceLogos = {
  desktop: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Desktop_computer_clipart_-_Yellow_theme.svg",
  mobile: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Smartphone_icon.svg",
  tablet: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Tablet_icon.svg",
  default: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Desktop_computer_clipart_-_Yellow_theme.svg"
};

const filterOptions = [
  { value: "browser", label: "Browser" },
  { value: "os", label: "Operating System" },
  { value: "device", label: "Device Type" },
];

export default function Devices() {
  const [filterBy, setFilterBy] = useState("browser");

  // Fetch devices data from Redux store
  const analytics = useSelector(analyticsData);
  const devicesData = analytics?.devices || {};

  // Get selected category data (Browser, OS, or Device)
  const deviceData = devicesData[filterBy] || [];

  // Calculate total users for selected category
  const totalUsers = deviceData.reduce((sum, item) => sum + item.count, 0);

  const getLogo = (name) => {
    const normalizedName = name.toLowerCase();
    switch (filterBy) {
      case 'browser':
        return browserLogos[normalizedName] || browserLogos.default;
      case 'os':
        return osLogos[normalizedName] || osLogos.default;
      case 'device':
        return deviceLogos[normalizedName] || deviceLogos.default;
      default:
        return browserLogos.default;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Device Analytics</h2>
        <Select
          value={filterBy}
          onChange={setFilterBy}
          style={{ width: 200 }}
          options={filterOptions}
        />
      </div>

      <div className="space-y-1">
        {deviceData.map((item) => (
          <div key={item.name} className="bg-white rounded-lg p-2.5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src={getLogo(item.name)} 
                    alt={item.name}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.count} users</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {((item.count / totalUsers) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
