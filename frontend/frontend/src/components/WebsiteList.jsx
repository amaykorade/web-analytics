import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getScriptThunk, deleteScriptThunk } from "../features/script/scriptSlice";
import { Globe, BarChart3, Users, MousePointer, TrendingUp, Calendar, Search, Plus, Filter, MoreVertical, ExternalLink, Trash2 } from "lucide-react";
import Layout from "./layout/Layout";
import { Modal } from "antd";

export default function WebsiteList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState(null);
  const scriptData = useSelector((state) => state.script.data);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await dispatch(getScriptThunk()).unwrap();
        // console.log('Fetched websites response:', response);
        // console.log('Scripts array:', response?.scripts);
      } catch (error) {
        console.error("Error fetching websites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [dispatch]);

  const handleWebsiteClick = (website) => {
    // console.log('Clicked website:', website);
    
    if (website.isVerified) {
      // If verified, go directly to dashboard
      localStorage.setItem("currentWebsite", JSON.stringify(website));
      navigate("/dashboard");
    } else {
      // If not verified, go to setup
      localStorage.setItem("pendingWebsite", JSON.stringify(website));
      navigate("/setup");
    }
  };

  const handleAddWebsite = () => {
    navigate("/setup");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-900/40 text-emerald-300 border border-emerald-700';
      case 'verification_incomplete': return 'bg-amber-900/40 text-amber-200 border border-amber-700';
      case 'inactive': return 'bg-red-900/40 text-red-300 border border-red-700';
      default: return 'bg-gray-800 text-gray-300 border border-gray-700';
    }
  };

  const getStatusText = (website) => {
    return website.isVerified ? 'Active' : 'Verification Incomplete';
  };

  const getStatusType = (website) => {
    return website.isVerified ? 'active' : 'verification_incomplete';
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'average': return 'text-yellow-300';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredWebsites = scriptData?.scripts?.filter(website => {
    const matchesSearch = website.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleDeleteClick = (e, website) => {
    e.stopPropagation(); // Prevent triggering the card click
    setWebsiteToDelete(website);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!websiteToDelete) return;

    try {
      // console.log("Attempting to delete website:", websiteToDelete);
      // console.log("Script ID being passed:", websiteToDelete._id);
      
      // Call the delete API
      await dispatch(deleteScriptThunk(websiteToDelete._id)).unwrap();
      
      // Refresh the website list
      await dispatch(getScriptThunk());
      
      // Close the modal
      setIsDeleteModalVisible(false);
      setWebsiteToDelete(null);
    } catch (error) {
      console.error('Error deleting website:', error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setWebsiteToDelete(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Add Website Row */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search websites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-4 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-sm text-gray-100 placeholder-gray-400 transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                >
                  ×
                </button>
              )}
            </div>
            <button 
              onClick={handleAddWebsite}
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium whitespace-nowrap border border-blue-900"
            >
              <Plus className="w-4 h-4" />
              <span>Add Website</span>
            </button>
          </div>

          {/* Website Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {scriptData?.scripts?.map((website) => (
              <div
                key={website._id}
                onClick={() => handleWebsiteClick(website)}
                className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 hover:shadow-lg hover:border-blue-500 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                <div className="p-6">
                  {/* Website Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-900/40 to-blue-800/60 rounded-xl flex items-center justify-center text-lg border border-blue-700/50">
                        <Globe className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors text-base truncate">
                          {website.websiteName}
                        </h3>
                        <p className="text-sm text-gray-400 truncate font-medium">{website.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(getStatusType(website))} ml-2`}>
                        {getStatusText(website)}
                      </span>
                      <button
                        onClick={(e) => handleDeleteClick(e, website)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete website"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Visitors</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">-</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Revenue</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">-</p>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${website.isVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span className="text-gray-500">Last updated just now</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="border-t bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors font-medium">
                      <BarChart3 className="w-4 h-4" />
                      <span>{website.isVerified ? 'View Analytics Dashboard' : 'Complete Verification'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          <Modal
            title="Delete Website"
            open={isDeleteModalVisible}
            onOk={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <div className="py-4">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{websiteToDelete?.websiteName}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. All tracking data for this website will be permanently deleted.
              </p>
            </div>
          </Modal>

          {/* Empty State */}
          {(!scriptData?.scripts || scriptData.scripts.length === 0) && (
            <div className="text-center py-12">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No websites found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search criteria.' 
                  : 'Get started by adding your first website.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button 
                    onClick={handleAddWebsite}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Website</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 