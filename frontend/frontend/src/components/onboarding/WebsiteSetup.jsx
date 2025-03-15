import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Globe, Copy, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateScriptThunk,
  getScriptThunk,
  verifyScriptThunk,
} from "../../features/script/scriptSlice";
import { authData, getCurrentUserthunk } from "../../features/user/userSlice";

export default function WebsiteSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [userID, setUserID] = useState(null);
  const [script, setScript] = useState("");
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    dispatch(getCurrentUserthunk())
      .unwrap()
      .then((response) => {
        if (response?.userID) {
          localStorage.setItem("userID", response.userID);
          setUserID(response.userID);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user details.");
      })
      .finally(() => setLoading(false)); // Set loading to false after fetching user
  }, [dispatch]);

  const handleUrlSubmit = (e) => {
    e.preventDefault();

    if (!url) {
      setError("Please enter a website URL");
      return;
    }

    try {
      new URL(url);
      setError("");
      setStep(2);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    const userId = localStorage.getItem("userID");
    if (!userId) {
      setError("User ID not found. Please try again.");
      return;
    }

    const formData = { url, name, userId };

    dispatch(generateScriptThunk(formData))
      .unwrap()
      .then((response) => {
        if (response) {
          setScript(response.script);
        } else {
          console.error("Failed to retrieve script from response");
        }
      });
  };

  const handleVerification = async () => {
    setIsVerifying(true);

    const userId = localStorage.getItem("userID");
    if (!userId) {
      setError("User ID not found. Please try again.");
      setIsVerifying(false);
      return;
    }

    const formData = { url, name, userId };

    dispatch(verifyScriptThunk(formData))
      .unwrap()
      .then((response) => {
        if (response?.verified) {
          setIsVerified(true);
          navigate("/dashboard");
        } else {
          setError("Failed to verify script.");
          setIsVerifying(false);
        }
      })
      .catch(() => {
        setError("Error verifying script. Please try again.");
      })
      .finally(() => setIsVerifying(false));
  };

  useEffect(() => {
    if (isVerified) {
      dispatch(getScriptThunk())
        .unwrap()
        .then((response) => {
          if (response?.isPresent) {
            navigate("/dashboard");
          }
        })
        .catch(() => setError("Error fetching script."));
    }
  }, [isVerified, dispatch, navigate]);

  if (isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Globe className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set up website tracking
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 && (
            <form onSubmit={handleUrlSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="block w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Website"
                  className="block w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>

              {error && (
                <div className="bg-red-50 p-4 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!userID} // Disable button until userID is available
                className="w-full py-2 bg-indigo-600 text-white rounded-md shadow-sm"
              >
                {userID ? "Continue" : "Loading User ID..."}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 p-4 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Copy this tracking script
                </label>
                <div className="bg-gray-50 rounded-md p-4">
                  <pre className="text-sm text-gray-800">{script}</pre>
                  <button onClick={() => navigator.clipboard.writeText(script)}>
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleVerification}
                disabled={isVerifying}
                className="w-full py-2 bg-indigo-600 text-white rounded-md"
              >
                {isVerifying ? "Verifying..." : "Verify Installation"}
              </button>

              <button
                onClick={() => setStep(1)}
                className="text-sm text-indigo-600"
              >
                ← Back to website details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
