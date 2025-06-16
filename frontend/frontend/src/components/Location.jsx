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
  const locations = analytics?.visitorsLocation || {};

  // Mapping locationType to actual data keys
  const locationKeyMap = {
    countries: "visitorCountries",
    states: "visitorStates",
    cities: "visitorCities",
  };

  // Extract correct data based on selected location type
  const currentLocationData = locations[locationKeyMap[locationType]]?.map((location) => ({
    name: location.name,
    visitors: location.count,
    percentage: parseFloat(location.percentage),
  })) || [];

  // Calculate total visitors
  const totalVisitors = currentLocationData.reduce(
    (sum, location) => sum + location.visitors,
    0
  );

  const handleLocationClick = (location) => {
    setSelectedLocation(selectedLocation?.name === location.name ? null : location);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Location Analytics</h2>
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
          {locationTypes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setLocationType(id);
                setSelectedLocation(null);
              }}
              className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                locationType === id
                  ? "bg-gray-700 text-white shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {currentLocationData.map((location, index) => {
          const isSelected = selectedLocation?.name === location.name;

          return (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-2.5 hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700"
              onClick={() => handleLocationClick(location)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${index < 3 ? "bg-indigo-400" : "bg-gray-500"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{location.name}</p>
                    <p className="text-xs text-gray-300">{location.visitors.toLocaleString()} visitors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{location.percentage}%</p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-300">Bounce Rate</p>
                      <p className="text-sm font-medium text-white">42%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300">Avg. Session</p>
                      <p className="text-sm font-medium text-white">4m 32s</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {currentLocationData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No locations found</div>
          <div className="text-sm text-gray-300">
            Try adjusting your search terms
          </div>
        </div>
      )}
    </div>
  );
}
