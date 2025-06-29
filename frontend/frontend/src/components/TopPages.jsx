import React, { useState, useEffect } from "react";
import { 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Eye, 
  MousePointer, 
  BarChart3, 
  GitBranch, 
  TrendingUp, 
  RefreshCw, 
  ArrowRight,
  Info
} from "lucide-react";
import { useSelector } from "react-redux";
import { analyticsData } from "../features/data/dataSlice";
import { socket } from '../services/dataApi';

export default function TopPages() {
  const analytics = useSelector(analyticsData);
  const topPages = analytics?.topPages || [];
  
  // State for current view and real-time data
  const [currentView, setCurrentView] = useState('standard');
  const [liveData, setLiveData] = useState({
    liveViewers: {},
    navigationPaths: [],
    pagePopularity: [],
    pageFlow: {
      mainFlow: [],
      secondaryPages: []
    }
  });

  // View options configuration
  const viewOptions = [
    { id: 'standard', label: 'Standard View', icon: BarChart3 },
    { id: 'navigation', label: 'Navigation Paths', icon: GitBranch },
    { id: 'popularity', label: 'Page Popularity', icon: TrendingUp },
    { id: 'flow', label: 'Page Flow', icon: RefreshCw }
  ];

  // WebSocket listeners for real-time updates
  useEffect(() => {
    const handleLivePageView = (event) => {
      console.log('Received livePageView:', event);
      // Don't increment here - let the backend handle unique visitor counting
      // The backend will send pagePopularity updates with the correct counts
    };

    const handleLiveNavigation = (event) => {
      console.log('Received liveNavigation:', event);
      setLiveData(prev => ({
        ...prev,
        navigationPaths: [
          {
            visitorId: event.visitorId,
            pages: event.navigationPath,
            time: new Date().toLocaleTimeString()
          },
          ...prev.navigationPaths.slice(0, 9) // Keep last 10
        ]
      }));
    };

    const handleNavigationPathsUpdate = (event) => {
      console.log('Received navigationPathsUpdate:', event);
      setLiveData(prev => ({
        ...prev,
        navigationPaths: event.navigationPaths
      }));
    };

    const handlePageExit = (event) => {
      console.log('Received pageExit:', event);
      // Don't decrement here - let the backend handle unique visitor counting
      // The backend will send pagePopularity updates with the correct counts
    };

    const handlePagePopularity = (event) => {
      console.log('Received pagePopularity:', event);
      setLiveData(prev => ({
        ...prev,
        pagePopularity: event.popularity,
        // Update live viewers from the backend's accurate count
        liveViewers: event.popularity.reduce((acc, page) => {
          acc[page.path] = page.viewers;
          return acc;
        }, {})
      }));
    };

    const handlePageFlow = (event) => {
      console.log('Received pageFlow:', event);
      setLiveData(prev => ({
        ...prev,
        pageFlow: event.flow
      }));
    };

    // Handle initial page popularity data
    const handleInitialPagePopularity = (event) => {
      console.log('Received initialPagePopularity:', event);
      setLiveData(prev => ({
        ...prev,
        pagePopularity: event.popularity,
        // Initialize live viewers from popularity data
        liveViewers: event.popularity.reduce((acc, page) => {
          acc[page.path] = page.viewers;
          return acc;
        }, {})
      }));
    };

    // Listen for real-time events
    socket.on('livePageView', handleLivePageView);
    socket.on('liveNavigation', handleLiveNavigation);
    socket.on('navigationPathsUpdate', handleNavigationPathsUpdate);
    socket.on('pageExit', handlePageExit);
    socket.on('pagePopularity', handlePagePopularity);
    socket.on('pageFlow', handlePageFlow);
    socket.on('initialPagePopularity', handleInitialPagePopularity);

    return () => {
      socket.off('livePageView', handleLivePageView);
      socket.off('liveNavigation', handleLiveNavigation);
      socket.off('navigationPathsUpdate', handleNavigationPathsUpdate);
      socket.off('pageExit', handlePageExit);
      socket.off('pagePopularity', handlePagePopularity);
      socket.off('pageFlow', handlePageFlow);
      socket.off('initialPagePopularity', handleInitialPagePopularity);
    };
  }, []);

  const formatUrl = (url) => {
    try {
      if (typeof url === 'object' && url !== null) {
        return url.pathname || '/';
      }
      if (typeof url === 'string' && url.startsWith('http')) {
        const urlObj = new URL(url);
        return urlObj.pathname;
      }
      return url;
    } catch (error) {
      return url;
    }
  };

  // Standard View Component
  const StandardView = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Page
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center justify-end space-x-1">
                  <span>Unique Views</span>
                  <div className="relative group">
                    <Info className="h-3 w-3 text-gray-400 cursor-help hover:text-gray-300" />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                      Number of different visitors who viewed this page
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center justify-end space-x-1">
                  <span>Total Views</span>
                  <div className="relative group">
                    <Info className="h-3 w-3 text-gray-400 cursor-help hover:text-gray-300" />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                      Total number of times this page was viewed (including repeat visits)
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Live Now
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Avg. Time
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Bounce Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {topPages.map((page, index) => {
              const liveViewers = liveData.liveViewers[formatUrl(page.url)] || 0;
              return (
                <tr key={index} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {formatUrl(page.url)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    {page.uniqueVisitors || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-right">
                    {page.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {liveViewers > 0 && (
                      <div className="flex items-center justify-end space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400">{liveViewers}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    {page.avgTimeSpent || '0s'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    {page.bounceRate}
                  </td>
                </tr>
              );
            })}
            {topPages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                  No page data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Navigation Paths View Component
  const NavigationView = () => {
    console.log('NavigationView render - liveData.navigationPaths:', liveData.navigationPaths);
    
    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <div className="text-sm text-gray-400 mb-3">
          Recent visitor navigation paths (last 10 minutes)
        </div>
        
        {liveData.navigationPaths.map((path, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Visitor {path.visitorId.slice(-4)}</span>
              <span className="text-xs text-gray-400">{path.time}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs flex-wrap">
              {path.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  <span className="text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                    {page}
                  </span>
                  {pageIndex < path.pages.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-gray-500" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        
        {liveData.navigationPaths.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No navigation data available
          </div>
        )}
      </div>
    );
  };

  // Page Popularity View Component
  const PopularityView = () => {
    const maxViewers = Math.max(...liveData.pagePopularity.map(p => p.viewers), 1);
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-400 mb-3">
          Current page popularity (live viewers)
        </div>
        
        {liveData.pagePopularity.map((page, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-32 text-sm text-gray-300 truncate">
              {page.path}
            </div>
            <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(page.viewers / maxViewers) * 100}%` }}
              ></div>
            </div>
            <div className="w-8 text-sm text-gray-300 text-right">
              {page.viewers}
            </div>
          </div>
        ))}
        
        {liveData.pagePopularity.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No popularity data available
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400 border-t border-gray-700 pt-3">
          Each bar represents 1 viewer currently on page
        </div>
      </div>
    );
  };

  // Page Flow View Component
  const FlowView = () => {
    console.log('FlowView render - liveData.pageFlow:', liveData.pageFlow);
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-400 mb-3">
          Live user flow between pages
        </div>
        
        <div className="relative">
          {/* Main conversion flow */}
          {liveData.pageFlow.mainFlow.length > 0 && (
            <div className="flex items-center justify-between mb-6 overflow-x-auto">
              {liveData.pageFlow.mainFlow.map((page, index) => (
                <React.Fragment key={index}>
                  <div className="text-center min-w-[100px]">
                    <div className="bg-cyan-600 rounded-lg p-3 mb-2">
                      <div className="text-sm text-white font-medium">{page.path}</div>
                      <div className="text-xs text-cyan-200">({page.viewers})</div>
                    </div>
                  </div>
                  {index < liveData.pageFlow.mainFlow.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-gray-500 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          
          {/* Secondary pages */}
          {liveData.pageFlow.secondaryPages.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {liveData.pageFlow.secondaryPages.map((page, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-700 rounded-lg p-2">
                    <div className="text-sm text-gray-300">{page.path}</div>
                    <div className="text-xs text-gray-400">({page.viewers})</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {liveData.pageFlow.mainFlow.length === 0 && liveData.pageFlow.secondaryPages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No flow data available
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Top Pages</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Live Updates</span>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {viewOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => setCurrentView(option.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                currentView === option.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Based on Selected View */}
      {currentView === 'standard' && <StandardView />}
      {currentView === 'navigation' && <NavigationView />}
      {currentView === 'popularity' && <PopularityView />}
      {currentView === 'flow' && <FlowView />}
    </div>
  );
}
