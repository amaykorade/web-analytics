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
  CreditCard,
  FileText,
  MessageSquare,
  ExternalLink,
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
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo4.png" className="h-6 w-6" />
                <span className="text-xl font-bold text-white">
                  WebAnalytics
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* <button
                onClick={() => setIsProductOpen(!isProductOpen)}
                className="inline-flex items-center px-1 pt-1 my-5 text-sm font-medium text-gray-300 hover:text-white"
              >
                Product
                <ChevronDown className="ml-1 h-4 w-4" />
              </button> */}

              {/* {isProductOpen && (
                <div className="absolute z-10 mt-3 w-screen max-w-md transform px-2 sm:px-0">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-gray-800 px-5 py-6 sm:gap-8 sm:p-8">
                      <Link
                        to="/dashboard"
                        className="flex items-start rounded-lg p-3 hover:bg-gray-700"
                      >
                        <LayoutDashboard className="h-6 w-6 text-indigo-400" />
                        <div className="ml-4">
                          <p className="text-base font-medium text-white">
                            Dashboard
                          </p>
                          <p className="mt-1 text-sm text-gray-300">
                            Get a bird's-eye view of your analytics
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/visitors"
                        className="flex items-start rounded-lg p-3 hover:bg-gray-700"
                      >
                        <Users className="h-6 w-6 text-indigo-400" />
                        <div className="ml-4">
                          <p className="text-base font-medium text-white">
                            Visitor Analytics
                          </p>
                          <p className="mt-1 text-sm text-gray-300">
                            Track user behavior and engagement
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/goals"
                        className="flex items-start rounded-lg p-3 hover:bg-gray-700"
                      >
                        <Goal className="h-6 w-6 text-indigo-400" />
                        <div className="ml-4">
                          <p className="text-base font-medium text-white">
                            Goals
                          </p>
                          <p className="mt-1 text-sm text-gray-300">
                            Set and track conversion goals
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/performance"
                        className="flex items-start rounded-lg p-3 hover:bg-gray-700"
                      >
                        <Gauge className="h-6 w-6 text-indigo-400" />
                        <div className="ml-4">
                          <p className="text-base font-medium text-white">
                            Performance
                          </p>
                          <p className="mt-1 text-sm text-gray-300">
                            Monitor site speed and metrics
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )} */}

              <Link
                to="/docs"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white"
              >
                Documentation
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center z-1000">
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <User className="h-6 w-4 text-gray-300" />
                <ChevronDown className="h-4 w-4 text-gray-300" />
              </button>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-sm text-gray-300">{email}</p>
                  </div>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <Link
                    to="/billing"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </Link>
                  <Link
                    to="/legal/contact-us"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Us
                  </Link>
                  <Link
                    to="/legal/terms-and-conditions"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Terms & Conditions
                  </Link>
                  <Link
                    to="/legal/refund-cancellation"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Refund & Cancellation
                  </Link>

                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
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
