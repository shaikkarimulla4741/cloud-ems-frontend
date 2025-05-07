import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
      <div
        className="bg-opacity-30 shadow-2xl rounded-2xl p-10 w-full max-w-md text-center backdrop-blur-md"
        style={{
          background: "linear-gradient(to bottom right, #bbdefb, #e3f2fd)",
        }}
      >
        <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">403 - Forbidden</h2>
        <p className="text-gray-600 mt-2">
          You do not have permission to access this page.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-2xl transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
