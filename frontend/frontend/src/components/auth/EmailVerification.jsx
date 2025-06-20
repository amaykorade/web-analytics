import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Mail, AlertCircle } from "lucide-react";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. Please try signing up again.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`https://backend.webmeter.in/api/user/verify?token=${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in to your account.");
          
          // Store the token if provided
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/logo4.png" className="h-10 w-10" alt="Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
          Email Verification
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-lg border border-gray-700 sm:rounded-lg sm:px-10">
          {status === "verifying" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-300">Verifying your email...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-green-200">
                Verification Successful!
              </h3>
              <p className="mt-2 text-gray-300">{message}</p>
              <p className="mt-4 text-sm text-gray-400">
                Redirecting to login page...
              </p>
            </div>
          )}
          
          {status === "error" && (
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-red-200">
                Verification Failed
              </h3>
              <p className="mt-2 text-gray-300">{message}</p>
              <div className="mt-6 space-y-3">
                <Link
                  to="/signup"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Try Signing Up Again
                </Link>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md text-sm font-medium text-gray-200 bg-gray-900 hover:bg-gray-800"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 