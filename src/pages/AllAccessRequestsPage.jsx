import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllAccessRequests,
  updateAccessStatus,
} from "../services/accessRequestService";
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

const AllAccessRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const hasAuthority = localStorage.getItem("hasAuthority") === "true";
    const userRole = localStorage.getItem("userRole");

    if (!hasAuthority && !["HR", "ADMIN"].includes(userRole)) {
      navigate("/403");
    }
  }, [navigate]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchAllAccessRequests();
        // setRequests(data.filter((req) => req.status === "PENDING"));
        setRequests(data); // ✅ No filter!
      } catch (error) {
        console.error("Failed to load access requests:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAccessStatus(id, status);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

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
              sx={{ color: "#0d47a1", fontWeight: "bold" }}
            >
              Access Requests
            </Typography>

            <Box sx={{ display: "flex", gap: 2, marginBottom: "16px" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/access-request")}
                sx={{
                  background: "white",
                  color: "#1565c0",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  "&:hover": { background: "#f0f0f0" },
                }}
              >
                Apply Access Request
              </Button>
            </Box>

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
                sx={{ color: "#0d47a1", fontWeight: "bold" }}
              >
                Pending Access Requests
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        background:
                          "linear-gradient(to right, #0d47a1, #1976d2)",
                      }}
                    >
                      {[
                        "Employee",
                        "Email",
                        "Service",
                        "Permissions",
                        "Project",
                        "Expiry",
                        "Status",
                        "Actions",
                        "Approved By",
                        "Approver Email",
                      ].map((header, index, array) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                            ...(index === 0 && { borderTopLeftRadius: "12px" }),
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No pending access requests.
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests.map((request) => (
                        <TableRow
                          key={request.id}
                          sx={{ "&:hover": { backgroundColor: "#f1faff" } }}
                        >
                          <TableCell align="center">
                            {request.employeeName}
                          </TableCell>
                          <TableCell align="center">
                            {request.employeeEmail}
                          </TableCell>
                          <TableCell align="center">
                            {request.serviceType}
                          </TableCell>
                          <TableCell align="center">
                            {request.permissions}
                          </TableCell>
                          <TableCell align="center">
                            {request.projectName}
                          </TableCell>

                          <TableCell align="center">
                            {new Date(request.expiryDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: "bold",
                              color:
                                request.status === "APPROVED"
                                  ? "#2e7d32"
                                  : request.status === "REJECTED"
                                  ? "#d32f2f"
                                  : "#ff9800",
                            }}
                          >
                            {request.status}
                          </TableCell>

                          <TableCell align="center">
                            {request.status === "PENDING" ? (
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
                                    handleStatusUpdate(request.id, "APPROVED")
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() =>
                                    handleStatusUpdate(request.id, "REJECTED")
                                  }
                                >
                                  Reject
                                </Button>
                              </Box>
                            ) : (
                              <Typography align="center" sx={{ color: "#555" }}>
                                -
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell align="center">
                            {request.approvedByName || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {request.approvedByEmail || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default AllAccessRequestsPage;