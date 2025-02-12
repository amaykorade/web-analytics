import React from "react";
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

function App() {
  let isAuthenticated = false;
  let hasWebsite = true;

  const token = localStorage.getItem("token");
  if (token) {
    isAuthenticated = !isAuthenticated;
  }

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
