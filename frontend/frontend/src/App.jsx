import React, { useEffect } from "react";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./styles/antd-dark.css";

import Signup from "./components/auth/signup";
import Login from "./components/auth/login";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/Dashboard";
import LocationDevices from "./components/Devices";
import ReferralSources from "./components/ReferralSources";
import WebsiteSetup from "./components/onboarding/WebsiteSetup";
import LandingPage from "./components/LandingPage";
import Location from "./components/Location";
import { useSelector } from "react-redux";
import { userData } from "./features/script/scriptSlice";
import PrivacyPolicy from "./components/PrivacyPolicy";
import WebsiteList from "./components/WebsiteList";

import ContactPage from "./components/legal/ContactUs";
import TermsAndConditions from "./components/legal/TermsAndCondition";
import RefundCancellationPage from "./components/legal/RefundAndCancellation";
import GoogleCallback from "./components/GoogleCallback";
import BillingPage from "./components/BillingPage";
import PaymentSuccess from "./components/payment/PaymentSuccess";
import PaymentFailure from "./components/payment/PyamentFailure";
import FunnelManager from './components/FunnelManager';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const scriptData = useSelector(userData);
  // console.log(scriptData);

  console.log("isAuth: ", isAuthenticated);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth); // Handle token updates across tabs

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);
  let hasWebsite = true;

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Layout>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/websites"
            element={
              isAuthenticated ? (
                <WebsiteList />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/location" element={<Location />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal/contact-us" element={<ContactPage />} />
          <Route
            path="/legal/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route
            path="/legal/refund-cancellation"
            element={<RefundCancellationPage />}
          />
          <Route path="/google/callback" element={<GoogleCallback />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentFailure />} />

          <Route
            path="/setup"
            element={
              isAuthenticated ? (
                <WebsiteSetup />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/funnel" element={<FunnelManager />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
