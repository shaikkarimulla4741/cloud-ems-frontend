import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../services/employeeService";
import Navbar from "../components/Navbar";

const RegisterEmployeePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Company email
    userEmail: "", // Employee's personal email
    role: "EMPLOYEE",
    hasAuthority: false, // 🔹 New field added
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // Control visibility

  const navigate = useNavigate();

  // Hide message automatically after 2 seconds
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await employeeService.registerEmployee(formData);

      // ✅ Show backend success message
      setMessage(response.data);
      setIsSuccess(true); // Flag to indicate success

      setTimeout(() => {
        navigate("/admin"); // Redirect after 3 seconds
      }, 4000);
    } catch (error) {
      // ❌ Show error message in red
      setMessage(error.response?.data || "Error registering employee.");
      setIsSuccess(false);
      console.error("Error registering employee", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 mt-[-50px]">
        <div
          className="bg-opacity-30 shadow-lg rounded-2xl p-10 w-full max-w-3xl backdrop-blur-md"
          style={{
            background: "linear-gradient(to bottom right, #bbdefb, #e3f2fd)",
          }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3 text-center">
            Add Employee
          </h2>

          {/* ✅ Floating Pop-up Message */}
          {showMessage && (
            <div
              className={`fixed top-10 left-1/2 transform -translate-x-1/2 w-[300px] text-white shadow-lg border px-6 py-3 rounded-lg text-center transition-all duration-300 animate-fade-in
    ${isSuccess ? "bg-green-500" : "bg-red-600"}`}
            >
              <p className="font-medium">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Company Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Company Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Personal Email and User Role in the same row */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Personal Email
                </label>
                <input
                  type="email"
                  name="userEmail"
                  placeholder="Enter Personal Email"
                  value={formData.userEmail}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  User Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <input
                  type="checkbox"
                  name="hasAuthority"
                  checked={formData.hasAuthority}
                  onChange={(e) =>
                    setFormData({ ...formData, hasAuthority: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600"
                />
                <span>Grant Access Approval Permission </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-5 border-t mt-5">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-5 py-3 border rounded-2xl text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployeePage;