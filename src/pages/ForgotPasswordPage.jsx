import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import authService from "../services/authService";
import { User } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const responseMessage = await authService.sendForgotPasswordRequest(email);
      setMessage(responseMessage);
      setShowPopup(true); // Show popup

      // Auto-hide popup and navigate after 2 seconds
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
      setShowPopup(true); // Show popup for error
      setTimeout(() => setShowPopup(false), 3000);
    }
  };
  

  return (

    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-100 to-blue-50">
      <div className="min-h-screen flex items-center justify-center px-4 mt-[-50px]">
        <div
          className="bg-opacity-30 shadow-lg rounded-2xl p-10 w-full max-w-2xl backdrop-blur-md"
          style={{
            background: "linear-gradient(to bottom right, #bbdefb, #e3f2fd)",
          }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3 text-center">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-600 text-center mb-4">
            Please enter your email to identify your account and reset your password.
          </p>

          {showPopup && (
            <div
              className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white text-sm rounded-lg shadow-lg transition-opacity duration-300 ${
                message ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message || error}
            </div>
          )}

          {/* {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>} */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Enter your Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full p-3 pl-10 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center pt-5 border-t mt-5">
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default ForgotPasswordPage;
