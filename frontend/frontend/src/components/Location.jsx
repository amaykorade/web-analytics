import React, { useState } from "react";
import {
  MapPin,
  Building2,
  Building,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { useSelector } from "react-redux";
import { analyticsData } from "../features/data/dataSlice";

const locationTypes = [
  { id: "countries", label: "Countries", icon: MapPin },
  { id: "states", label: "States", icon: Building2 },
  { id: "cities", label: "Cities", icon: Building },
];

export default function Location() {
  const [locationType, setLocationType] = useState("countries");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const analytics = useSelector(analyticsData);
  console.log("analytics:", analytics);
  const locations = analytics?.visitorsLocation || {};

  // Mapping locationType to actual data keys
  const locationKeyMap = {
    countries: "visitorCountries",
    states: "visitorStates",
    cities: "visitorCities",
  };

  // Extract correct data based on selected location type
  const currentLocationData =
    locations[locationKeyMap[locationType]]?.map((location) => ({
      name: location.name,
      visitors: location.count, // Adjusting key from count to visitors
      percentage: parseFloat(location.percentage), // Removing % sign for calculations
      trend: "+0%", // Placeholder trend, modify if trend data is available
    })) || [];

  const totalVisitors = currentLocationData.reduce(
    (sum, location) => sum + location.visitors,
    0
  );

  const handleLocationClick = (location) => {
    setSelectedLocation(
      selectedLocation?.name === location.name ? null : location
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Visitor Locations
        </h3>
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${locationType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Location Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {locationTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setLocationType(id);
                  setSelectedLocation(null);
                  setSearchTerm("");
                }}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  locationType === id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-sm text-indigo-600 font-medium">
            Total Visitors
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalVisitors.toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Top Location</div>
          <div className="text-2xl font-bold text-gray-900">
            {currentLocationData[0]?.name || "N/A"}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium">
            Average Growth
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {currentLocationData.length > 0
              ? `${Math.round(
                  currentLocationData.reduce(
                    (sum, loc) => sum + loc.percentage,
                    0
                  ) / currentLocationData.length
                )}%`
              : "0%"}
          </div>
        </div>
      </div> */}

      {/* Location List */}
      <div className="space-y-3">
        {currentLocationData.map((location, index) => {
          const isSelected = selectedLocation?.name === location.name;
          const isTrendPositive = location.trend.startsWith("+");

          return (
            <div
              key={index}
              className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected ? "ring-2 ring-indigo-500" : "hover:bg-gray-100"
              }`}
              onClick={() => handleLocationClick(location)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      index < 3 ? "bg-indigo-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="font-medium text-gray-900">
                    {location.name}
                  </span>
                </div>
                {/* <div className="flex items-center space-x-4">
                  <span
                    className={`text-sm font-medium ${
                      isTrendPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {location.trend}
                  </span>
                  <ArrowUpRight
                    className={`h-4 w-4 ${
                      isTrendPositive
                        ? "text-green-500"
                        : "text-red-500 transform rotate-90"
                    }`}
                  />
                </div> */}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {location.visitors.toLocaleString()} visitors
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {location.percentage}%
                </div>
              </div>

              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${location.percentage}%` }}
                />
              </div>

              {isSelected && (
                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-500">Bounce Rate</div>
                    <div className="text-lg font-medium text-gray-900">42%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Avg. Session</div>
                    <div className="text-lg font-medium text-gray-900">
                      4m 32s
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {currentLocationData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No locations found</div>
          <div className="text-sm text-gray-500">
            Try adjusting your search terms
          </div>
        </div>
      )}

      {/* Footer */}
      {/* <div className="mt-6 text-center text-sm text-gray-500">
        Data updated every 5 minutes • Last 30 days
      </div> */}
    </div>
  );
}
