import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import verifyEmail from "../services/emailverificationService"; // Backend API call

const VerifyEmailPage = () => {
  const [message, setMessage] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false); // ✅ Prevent multiple API calls
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("No token found.");
      setLoading(false);
      return;
    }

    if (!verified) { // ✅ Prevent duplicate API call
      setVerified(true); // ✅ Mark as verified to prevent re-execution
      verifyEmail(token)
        .then((response) => {
          console.log("Response after verification", response);
          setMessage(response);
          setLoading(false);
        //   setTimeout(() => navigate("/login"), 3000); // ✅ Redirect after 3s
        })
        .catch((error) => {
          setMessage("Invalid or expired token.");
          setLoading(false);
        });
    }
  }, [location, navigate, verified]); // ✅ Add `verified` dependency to prevent multiple calls

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow-md rounded-lg text-center">
        <h2 className="text-xl font-semibold">{message}</h2>
        
        {!loading && (
          <button
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;