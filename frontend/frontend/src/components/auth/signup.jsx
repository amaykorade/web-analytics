import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpthunk,
  verificationStatusThunk,
  resendVerificationEmailThunk,
} from "../../features/user/userSlice";
import { AlertCircle, Mail, User, Lock, RefreshCw } from "lucide-react";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isVerified, loading, error } = useSelector(
    (state) => state.user || {}
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/websites");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setShowResendButton(false);

    const formData = { name, email, password };
    try {
      const response = await dispatch(signUpthunk(formData)).unwrap();
      if (response?.token) {
        localStorage.setItem("token", response.token);
        setMessage("Verification email sent. Please check your inbox.");

        // Show resend button after 30 seconds
        setTimeout(() => {
          setShowResendButton(true);
        }, 30000);

        let attempts = 0;
        const intervalId = setInterval(async () => {
          if (attempts >= 10) {
            clearInterval(intervalId);
            setShowResendButton(true);
            return;
          }
          const verifyResponse = await dispatch(
            verificationStatusThunk(email)
          ).unwrap();
          if (verifyResponse.isVerified) {
            clearInterval(intervalId);
            setMessage("User verified successfully. Redirecting...");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }
          attempts++;
        }, 5000);
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const handleGoogleSignUp = async () => {
    window.location.href = "https://backend.webmeter.in/api/user/google";
  };

  const handleResendVerificationEmail = async () => {
    setResendLoading(true);
    try {
      await dispatch(resendVerificationEmailThunk(email)).unwrap();
      setMessage("Verification email resent. Please check your inbox.");
    } catch (err) {
      console.error("Resend verification email error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/logo4.png" className="h-10 w-10" alt="Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-lg border border-gray-700 sm:rounded-lg sm:px-10">
          {error && (
            <div className="rounded-md bg-red-900/30 p-4 flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3 text-sm font-medium text-red-200">
                {error}
              </div>
            </div>
          )}
          {message && (
            <div className="rounded-md bg-green-900/30 p-4 flex">
              <Mail className="h-5 w-5 text-green-400" />
              <div className="ml-3 text-sm font-medium text-green-200">
                {message}
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-900 hover:bg-gray-800"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
              />
              Sign up with Google
            </button>
          </div>
          {showResendButton && (
            <div className="mt-6">
              <button
                onClick={handleResendVerificationEmail}
                disabled={resendLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-900 hover:bg-gray-800"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                {resendLoading ? "Resending..." : "Resend verification email"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
