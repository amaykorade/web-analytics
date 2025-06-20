import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Globe, Copy, AlertCircle, CheckCircle2, ArrowRight, Code, Shield, Zap } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scriptData, setScriptData] = useState(null);

  const handleVerification = async () => {
    setIsVerifying(true);
    setError("");

    const userId = localStorage.getItem("userID");
    if (!userId) {
      setError("User ID not found. Please try again.");
      setIsVerifying(false);
      return;
    }

    const formData = { url, name, userId };

    try {
      const response = await dispatch(verifyScriptThunk(formData)).unwrap();
      // console.log('Verification response:', response);
      
      if (response?.verified) {
        setIsVerified(true);
        
        // Get the website data from the response
        const websiteData = {
          _id: response.scriptId,
          url: url,
          websiteName: name,
          userId: userId,
          verified: true
        };
        
        // console.log('Website data to store:', websiteData);
        
        // Store the current website
        localStorage.setItem("currentWebsite", JSON.stringify(websiteData));
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setError("Script verification failed. Please make sure you've added the script correctly and try again.");
        setIsVerified(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError("Error verifying script. Please try again.");
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Add a function to check if website is already verified
  const checkWebsiteVerification = async () => {
    try {
      const response = await dispatch(getScriptThunk()).unwrap();
      if (response?.scripts?.length > 0) {
        // Find the exact website by URL
        const website = response.scripts.find(w => w.url === url);
        if (website && website.verified) {
          localStorage.setItem("currentWebsite", JSON.stringify(website));
          navigate("/dashboard");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking verification:', error);
      return false;
    }
  };

  useEffect(() => {
    dispatch(getCurrentUserthunk())
      .unwrap()
      .then(async (response) => {
        if (response?.userID) {
          localStorage.setItem("userID", response.userID);
          setUserID(response.userID);
          
          // Check if there's a pending website from the website list
          const pendingWebsite = localStorage.getItem("pendingWebsite");
          if (pendingWebsite) {
            const website = JSON.parse(pendingWebsite);
            setUrl(website.url);
            setName(website.websiteName);
            
            // Check if this website is already verified
            const isVerified = await checkWebsiteVerification();
            if (isVerified) {
              // If verified, go directly to dashboard
              navigate("/dashboard");
            } else {
              // If not verified, show verification step
              setStep(2);
            }
            // Clear the pending website
            localStorage.removeItem("pendingWebsite");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user details.");
      })
      .finally(() => setLoading(false));
  }, [dispatch, navigate]);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      setError("Please enter a website URL");
      return;
    }

    try {
      new URL(url);
      setError("");
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    const userId = localStorage.getItem("userID");
    if (!userId) {
      setError("User ID not found. Please try again.");
      return;
    }

    // Check if website is already verified before proceeding
    const isVerified = await checkWebsiteVerification();
    if (isVerified) {
      // If verified, go directly to dashboard
      navigate("/dashboard");
      return;
    }

    // If not verified, proceed with script generation
    setStep(2);
    const formData = { url, websiteName: name, userId };

    dispatch(generateScriptThunk(formData))
      .unwrap()
      .then((response) => {
        if (response) {
          setScript(response.script);
          setScriptData(response);
        } else {
          console.error("Failed to retrieve script from response");
        }
      });
  };

  useEffect(() => {
    if (isVerified) {
      dispatch(getScriptThunk())
        .unwrap()
        .then((response) => {
          // console.log('Script data response:', response);
          if (response?.isPresent) {
            const website = response.scripts?.find(w => w.url === url);
            if (website?.verified) {
              navigate("/dashboard");
            } else {
              setError("Script verification failed. Please verify the installation again.");
              setIsVerified(false);
            }
          } else {
            // console.log('Script not present in response');
            setError("Script not found. Please verify the installation again.");
            setIsVerified(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching script:', error);
          setError("Error fetching script. Please try again.");
          setIsVerified(false);
        });
    }
  }, [isVerified, dispatch, navigate, url]);

  useEffect(() => {
    return () => {
      // No cleanup needed
    };
  }, []);

  if (isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Set Up Website Tracking</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Add our tracking script to your website to start collecting valuable insights about your visitors.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          {/* Progress Steps */}
          <div className="flex items-center justify-center p-6 border-b border-gray-700">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                1
              </div>
              <div className={`h-1 w-16 ${step === 2 ? 'bg-indigo-600' : 'bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                2
              </div>
            </div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <form onSubmit={handleUrlSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Website"
                    className="block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                {error && (
                  <div className="bg-red-900/50 p-4 rounded-lg flex items-start space-x-3 border border-red-700">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                    <p className="text-sm font-medium text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!userID}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {userID ? "Continue" : "Loading User ID..."}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Installation Steps</h3>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">GDPR Compliant</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">1</span>
                      </div>
                      <p className="text-sm text-gray-300">Copy the tracking script below</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">2</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Add the script to your website in one of these ways:</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start space-x-2">
                            <span className="text-indigo-400">•</span>
                            <p className="text-sm text-gray-300">In the &lt;head&gt; tag of your main HTML file</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-indigo-400">•</span>
                            <p className="text-sm text-gray-300">Just before the closing &lt;/body&gt; tag</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">3</span>
                      </div>
                      <p className="text-sm text-gray-300">Click "Verify Installation" once you've added the script</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Tracking Script
                    </label>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(script);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-700">
                      <code className="text-sm">{script}</code>
                    </pre>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/50 p-4 rounded-lg flex items-start space-x-3 border border-red-700">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                    <p className="text-sm font-medium text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-300"
                  >
                    ← Back to website details
                  </button>
                  <button
                    onClick={handleVerification}
                    disabled={isVerifying}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Installation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-300">Minimal impact on your website's loading speed with optimized tracking.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Privacy First</h3>
            <p className="text-gray-300">GDPR-compliant tracking that respects your visitors' privacy.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Easy Integration</h3>
            <p className="text-gray-300">Simple one-line script that works with any website platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
