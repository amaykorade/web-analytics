import React, { useEffect } from "react";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

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
import ContactPage from "./components/legal/ContactUs";
import TermsAndConditions from "./components/legal/TermsAndCondition";
import RefundCancellationPage from "./components/legal/RefundAndCancellation";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const scriptData = useSelector(userData);
  console.log(scriptData);

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
                hasWebsite ? (
                  <Layout>
                    <Dashboard />
                  </Layout>
                ) : (
                  <Navigate to="/setup" replace />
                )
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
