import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllLeaveRequests,
  updateLeaveStatus,
  fetchLeaveBalancesAdmin, // Updated to use batch endpoint
} from "../services/leaveRequestService";
import Navbar from "../components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const AdminLeaveRequests = () => {
  // State management
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch all pending leave requests
        const allRequests = await fetchAllLeaveRequests();
        const pendingRequests = allRequests.filter(
          (req) => req.status === "PENDING"
        );

        // 2. Extract unique employee IDs from pending requests
        const uniqueEmployeeIds = [
          ...new Set(pendingRequests.map((req) => req.employeeId)),
        ];

        // 3. Batch fetch balances in a single API call
        const balanceMap = await fetchLeaveBalancesAdmin(uniqueEmployeeIds);

        // Update state
        setBalances(balanceMap);
        setLeaveRequests(pendingRequests);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle approve/reject actions
  const handleAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      // Optimistically remove the request from UI
      setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  // Helper to display balance value with type safety
  const getBalanceDisplay = (employeeId, leaveType) => {
    if (!balances[employeeId]) return "N/A";
    const balanceKey = `${leaveType.toLowerCase()}LeaveDays`;
    const value = balances[employeeId][balanceKey];
    return value !== undefined ? value : "N/A";
  };

  // Color coding for low balances
  const getBalanceColor = (value) => {
    const numericValue = Number(value);
    return !isNaN(numericValue) && numericValue < 5 ? "red" : "inherit";
  };

  // Table column headers
  const tableHeaders = [
    "ID",
    "Employee",
    "Email",
    "Start Date",
    "End Date",
    "Type",
    "Sick Bal",
    "Casual Bal",
    "Annual Bal",
    "Reason",
    "Actions",
  ];

  // Leave types to display balances for
  const leaveTypes = ["Sick", "Casual", "Annual"];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <div className="flex-1">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <Box
            component={Paper}
            elevation={6}
            sx={{
              padding: "20px",
              borderRadius: "12px",
              background: "#bbdefb",
              marginLeft: "10px",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                color: "#0d47a1",
                fontWeight: "bold",
              }}
            >
              Employee Leave Requests
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginBottom: "16px",
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate("/employees/leave-request")}
                sx={{
                  background: "white",
                  color: "#1565c0",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  "&:hover": { background: "#f0f0f0" },
                }}
              >
                Apply Leave
              </Button>

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
            </Box>

            {/* Main Table */}
            <Box
              component={Paper}
              elevation={6}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                background: "#bbdefb",
              }}
            >
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{
                  color: "#0d47a1",
                  fontWeight: "bold",
                }}
              >
                Pending Leave Requests
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          background:
                            "linear-gradient(to right, #0d47a1, #1976d2)",
                        }}
                      >
                        {tableHeaders.map((header, index, array) => (
                          <TableCell
                            key={header}
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              textAlign: "center",
                              ...(index === 0 && {
                                borderTopLeftRadius: "12px",
                              }),
                              ...(index === array.length - 1 && {
                                borderTopRightRadius: "12px",
                              }),
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRequests.length > 0 ? (
                        leaveRequests.map((req) => (
                          <TableRow
                            key={req.id}
                            sx={{ "&:hover": { backgroundColor: "#f1faff" } }}
                          >
                            {/* Basic Request Info */}
                            <TableCell sx={{ textAlign: "center" }}>
                              {req.id}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {req.employeeName}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {req.employeeEmail}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {req.startDate}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {req.endDate}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {req.type}
                            </TableCell>

                            {/* Leave Balances */}
                            {leaveTypes.map((type) => (
                              <TableCell
                                key={type}
                                sx={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  color: getBalanceColor(
                                    getBalanceDisplay(req.employeeId, type)
                                  ),
                                }}
                              >
                                {getBalanceDisplay(req.employeeId, type)}
                              </TableCell>
                            ))}

                            <TableCell sx={{ textAlign: "center" }}>
                              {req.reason || "N/A"}
                            </TableCell>

                            {/* Action Buttons */}
                            <TableCell sx={{ textAlign: "center" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: { xs: "column", sm: "row" },
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() =>
                                    handleAction(req.id, "APPROVED")
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() =>
                                    handleAction(req.id, "REJECTED")
                                  }
                                >
                                  Reject
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={tableHeaders.length}
                            align="center"
                          >
                            No pending leave requests found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveRequests;