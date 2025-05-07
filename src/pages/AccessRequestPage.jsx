import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitAccessRequest } from "../services/accessRequestService";
import Navbar from "../components/Navbar";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";



const AccessRequestPage = () => {
  const navigate = useNavigate();
  const [accessData, setAccessData] = useState({
    serviceType: "",
    permissions: "",
    projectName: "",
    expiryDate: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitAccessRequest(accessData);
      setMessage("Access request submitted successfully!");
      setIsSuccess(true);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        navigate("/profile");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data || "Failed to submit access request");
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
            padding: 3,
            borderRadius: 2,
            width: "100%",
            maxWidth: 700,
            background: "#bbdefb",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/employees/my-access-requests")}
              sx={{
                background: "white",
                color: "#1565c0",
                fontWeight: "bold",
                borderRadius: "8px",
                "&:hover": { background: "#f0f0f0" },
              }}
            >
              My Access Requests
            </Button>
          </Box>

          {showMessage && (
            <div
              className={`p-3 mb-4 rounded ${
                isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <Box
            component={Paper}
            elevation={4}
            sx={{ padding: 3, borderRadius: 2, background: "white" }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ color: "#0d47a1", fontWeight: "bold" }}
            >
              New Access Request
            </Typography>
            <Divider sx={{ my: 2, backgroundColor: "#1565c0", height: 2 }} />

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                select
                label="Service Type"
                name="serviceType"
                value={accessData.serviceType}
                onChange={handleChange}
                required
              >
                {["AWS", "GCP", "GitHub", "Other"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Permissions"
                name="permissions"
                value={accessData.permissions}
                onChange={handleChange}
                required
                multiline
                rows={4}
                placeholder="Enter detailed permission requirements here (e.g., S3 Read access, EC2 Full Access...)"
              />

              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={accessData.projectName}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Expiry Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                name="expiryDate"
                value={accessData.expiryDate}
                onChange={handleChange}
                required
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ bgcolor: "#1565c0", "&:hover": { bgcolor: "#0d47a1" } }}
              >
                Submit Request
              </Button>
            </form>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default AccessRequestPage;
