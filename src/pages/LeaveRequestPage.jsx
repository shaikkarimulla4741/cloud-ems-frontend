import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  submitLeaveRequest,
  fetchLeaveBalance,
} from "../services/leaveRequestService";
import Navbar from "../components/Navbar";
import { FaCalendarAlt } from "react-icons/fa";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";


const LeaveRequestPage = () => {
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    type: "",
    reason: "",
  });
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const employeeId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetchLeaveBalance(employeeId);
        setLeaveBalance(response);
      } catch (err) {
        console.error("Failed to fetch leave balance:", err);
        setError("Unable to fetch leave balance. Please try again.");
      }
    };
    fetchBalance();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting leave request:", leaveData);
      const response = await submitLeaveRequest(leaveData);
      setMessage(
        response.data?.message || "Leave request submitted successfully!"
      );
      setIsSuccess(true);
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
        navigate("/profile", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Error submitting leave request:", err);
      setMessage(err.response?.data || "Failed to submit leave request.");
      setIsSuccess(false);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <Navbar />

      <div className="flex flex-col items-center justify-center px-4 mt-16">
        <Box
          component={Paper}
          elevation={6}
          sx={{
            padding: "20px",
            borderRadius: "12px",
            background: "#bbdefb",
            width: "100%",
            maxWidth: "700px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/employees/my-leave-requests")}
              sx={{
                background: "white",
                color: "#1565c0",
                fontWeight: "bold",
                borderRadius: "8px",
                "&:hover": { background: "#f0f0f0" },
              }}
            >
              My Leaves
            </Button>
            <Box
              sx={{
                background: "#f0f8ff",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #1565c0",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "14px", fontWeight: "bold", color: "#1565c0" }}
              >
                Leave Balance
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#444" }}>
                {leaveBalance
                  ? `Sick: ${leaveBalance.sickLeaveDays} | Casual: ${leaveBalance.casualLeaveDays} | Annual: ${leaveBalance.annualLeaveDays}`
                  : "Fetching balance..."}
              </Typography>
            </Box>
          </Box>

          {showMessage && (
            <div
              className={`w-full text-white text-center px-6 py-3 rounded-lg shadow-md mb-4 ${
                isSuccess ? "bg-green-500" : "bg-red-600"
              }`}
            >
              <p className="font-medium">
                {typeof message === "string"
                  ? message
                  : message?.message || "An error occurred"}
              </p>
            </div>
          )}

          <Box
            component={Paper}
            elevation={4}
            sx={{ padding: "20px", borderRadius: "12px", background: "white" }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ color: "#0d47a1", fontWeight: "bold" }}
            >
              Submit Leave Request
            </Typography>
            <Divider sx={{ my: 2, backgroundColor: "#1565c0", height: 2 }} />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Start Date", name: "startDate", type: "date" },
                  { label: "End Date", name: "endDate", type: "date" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-700 font-medium mb-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <FaCalendarAlt />
                      </span>
                      <input
                        type={field.type}
                        name={field.name}
                        value={leaveData[field.name]}
                        onChange={handleChange}
                        className="w-full p-3 pl-10 border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Leave Type
                  </label>
                  <select
                    name="type"
                    value={leaveData.type}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Leave Type</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="ANNUAL">Annual Leave</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Reason (Optional)
                  </label>
                  <textarea
                    name="reason"
                    value={leaveData.reason}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-5 border-t mt-5">
                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
                >
                  Submit Leave Request
                </button>
              </div>
            </form>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default LeaveRequestPage;