import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Globe, Copy, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateScriptThunk,
  getScriptThunk,
  verifyScriptThunk,
} from "../../features/script/scriptSlice";
import { authData } from "../../features/user/userSlice";

export default function WebsiteSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [script, setScript] = useState(``);
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  // const userInfo = useSelector(authData);

  // console.log("u: ", userInfo);

  // dispatch(getScriptThunk())
  //   .unwrap()
  //   .then((response) => {
  //     if (response?.isPresent == true) {
  //       navigate("/dashboard");
  //     }
  //     console.log(response.isPresent);
  //   });

  // This would be your unique tracking script

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a website URL");
      return;
    }
    // Validate URL format
    try {
      new URL(url);
      setError("");
      setStep(2);
    } catch {
      setError("Please enter a valid URL");
    }

    const formData = { url, name };

    dispatch(generateScriptThunk(formData))
      .unwrap()
      .then((response) => {
        if (response) {
          console.log(response.script);
          setScript(response.script);
        } else {
          console.error("Failed to retrieve token from response");
        }
      });
  };

  const handleCopyScript = () => {
    if (!script) {
      setError("No script available to copy");
      return;
    }
    navigator.clipboard.writeText(script);
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    const formData = { url, name };
    console.log("formData:", formData);
    dispatch(verifyScriptThunk(formData))
      .unwrap()
      .then((response) => {
        console.log("Generated Script Response:", response);
        if (response?.verified == true) {
          setIsVerified(true);
          navigate("/dashboard");
        } else {
          console.error("Failed to retrieve script from response");
          setError("Failed to generate script");
        }
      })
      .catch((error) => {
        console.error("Error generating script:", error);
        setError("Error generating script. Please try again.");
      });
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
  });

  if (isVerified) {
    return <Navigate to="/dashboard" replace />;
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
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's get your website analytics up and running
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Step 1: Enter Website URL */}
          {step === 1 && (
            <form onSubmit={handleUrlSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website URL
                </label>
                <div className="mt-1">
                  <input
                    id="url"
                    name="url"
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Website"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Install Tracking Script */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copy this tracking script
                </label>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
                      {script}
                    </pre>
                    <button
                      onClick={handleCopyScript}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Add this script to your website's <code>&lt;head&gt;</code>{" "}
                  section.
                </p>

                <button
                  onClick={handleVerification}
                  disabled={isVerifying}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {isVerifying ? "Verifying..." : "Verify Installation"}
                </button>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to website details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
