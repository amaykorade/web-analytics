import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getScriptThunk } from "../features/script/scriptSlice";
// import { Loginthunk } from "./features/user/userSlice";

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("token", token);

        try {
          const scriptData = await dispatch(getScriptThunk()).unwrap();

          if (scriptData?.isPresent) {
            console.log("Navigating to /dashboard...");
            setRedirectPath("/dashboard");
          } else {
            console.log("Navigating to /setup...");
            setRedirectPath("/setup");
          }
        } catch (error) {
          console.error("Error fetching script data:", error);
          setRedirectPath("/login");
        }
      } else {
        console.error("Google login failed. No token received.");
        setRedirectPath("/login");
      }
    };

    handleGoogleLogin();
  }, [dispatch]);

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [redirectPath, navigate]);

  return <div>Processing Google Login...</div>;
}
