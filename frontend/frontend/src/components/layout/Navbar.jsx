import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  Settings,
  HelpCircle,
  Bell,
  User as UserIcon,
  LayoutDashboard,
  Users,
  Goal,
  Gauge,
  LogOut,
  User,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { getCurrentUserthunk, logout } from "../../features/user/userSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    dispatch(getCurrentUserthunk())
      .unwrap()
      .then((response) => {
        // console.log("user: ", response);
        setName(response?.user?.name);
        setEmail(response?.user?.email);
      });
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                {/* <BarChart3 className="h-8 w-8 text-indigo-600" /> */}
                <img src="/logo4.png" className="h-6 w-6" />
                <span className="text-xl font-bold text-gray-900">
                  WebAnalytics
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* <div className="relative">
                <button
                  onClick={() => setIsProductOpen(!isProductOpen)}
                  className="inline-flex items-center px-1 pt-1 my-5 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Product
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isProductOpen && (
                  <div className="absolute z-10 mt-3 w-screen max-w-md transform px-2 sm:px-0">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                        <Link
                          to="/dashboard"
                          className="flex items-start rounded-lg p-3 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="h-6 w-6 text-indigo-600" />
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              Dashboard
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Get a bird's-eye view of your analytics
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/visitors"
                          className="flex items-start rounded-lg p-3 hover:bg-gray-50"
                        >
                          <Users className="h-6 w-6 text-indigo-600" />
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              Visitor Analytics
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Track user behavior and engagement
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/goals"
                          className="flex items-start rounded-lg p-3 hover:bg-gray-50"
                        >
                          <Goal className="h-6 w-6 text-indigo-600" />
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              Goals
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Set and track conversion goals
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/performance"
                          className="flex items-start rounded-lg p-3 hover:bg-gray-50"
                        >
                          <Gauge className="h-6 w-6 text-indigo-600" />
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              Performance
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Monitor site speed and metrics
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div> */}

              {/* <Link
                to="/pricing"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Pricing
              </Link> */}
              <Link
                to="/docs"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Documentation
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            {/* <button className="p-2 text-gray-400 hover:text-gray-500">
              <HelpCircle className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button> */}

            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <User className="h-8 w-5 border-2 border-gray-100 rounded-full" />
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {" "}
                      {name}{" "}
                    </p>
                    <p className="text-sm text-gray-500"> {email} </p>
                  </div>
                  {/* <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link> */}
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
