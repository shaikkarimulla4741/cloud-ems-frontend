import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { Lock } from "lucide-react"; // Importing Lock icon


const ResetForgotPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  // 🔹 Redirect if no token is present
  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect to login page if token is missing
    }

    if (error || success) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000); // Message disappears after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [token, navigate, error, success]);

  // Password Validation
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const message = await authService.resetForgottenPassword(
        token,
        newPassword
      );
      setSuccess(message);
      localStorage.clear;
      setTimeout(() => navigate("/"), 4000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-100 to-blue-50">
      <div className="min-h-screen flex items-center justify-center px-4 mt-[-30px]">
        <div
          className="bg-opacity-30 shadow-lg rounded-2xl p-10 w-full max-w-3xl backdrop-blur-md"
          style={{
            background: "linear-gradient(to bottom right, #bbdefb, #e3f2fd)",
          }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3 text-center">
            Reset Your Password
          </h2>

          <p className="text-sm text-gray-600 text-center mb-4">
            Enter a new password to reset your account password.
          </p>

          {showMessage && (
            <div
              className={`fixed top-10 left-1/2 transform -translate-x-1/2 text-white shadow-lg border px-6 py-3 rounded-lg text-center transition-all duration-300 animate-fade-in ${
                success ? "bg-green-600" : "bg-red-500"
              }`}
            >
              <p className="font-medium">{success || error}</p>
            </div>
          )}

          {/* {showMessage && (
            <div className="fixed top-10 left-1/2 transform -translate-x-1/2 text-white shadow-lg border px-6 py-3 rounded-lg text-center transition-all duration-300 animate-fade-in">
              <p className={`${success ? "bg-green-600" : "bg-red-500"} font-medium`}>
                {success || error}
              </p>
            </div>
          )} */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* New Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className={`w-full p-3 pl-10 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 
                    ${
                      newPassword
                        ? validatePassword(newPassword)
                          ? "border-blue-500 focus:ring-blue-500" // ✅ Blue when valid
                          : "border-red-500 focus:ring-red-500" // ❌ Red when invalid
                        : "border-gray-300 focus:ring-gray-300" // Default gray when empty
                    }`}
                  />

                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {newPassword && !validatePassword(newPassword) && (
                  <p className="text-red-500 text-xs mt-1">
                    Password must be at least 8 characters long, contain 1
                    uppercase letter, 1 number, and 1 special character.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className={`w-full p-3 pl-10 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                    // className="w-full p-3 pl-10 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex justify-end space-x-4 pt-5 border-t mt-5">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-3 border rounded-2xl text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetForgotPassword;