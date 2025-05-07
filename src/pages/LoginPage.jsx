import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

     // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || !emailRegex.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!password || password.length < 8) {
    setError("Password must be at least 8 characters long.");
    return;
  }

  try {
    const credentials = { email, password };
    const data = await authService.login(credentials, navigate);
    console.log("Login successful:", data);

    const userRole = localStorage.getItem("userRole");
    if (userRole === "HR" || userRole === "ADMIN") {
      navigate("/admin");
    } else if (userRole === "EMPLOYEE") {
      navigate("/profile");
    } else {
      navigate("/initial-password");
    }
  } catch (err) {
    // Set the exact error message received from the backend
    setError(typeof err === "string" ? err : "Failed to log in.");
  }
  
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 items-center justify-center">
      {/* Welcome Message with More Space */}
      <div className="text-center mr-20 mb-16 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to [Company Name]
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Login to access your account
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-6 w-full max-w-md">
        {/* {error && <p className="text-red-500">{error}</p>} */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-blue-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-blue-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          text="Login"
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >Login</button>

        <p className="text-center text-sm text-gray-500">
          © 2025 [Company Name]. All rights reserved.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
