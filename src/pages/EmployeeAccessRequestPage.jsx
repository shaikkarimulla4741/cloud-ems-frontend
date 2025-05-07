import React, { useEffect, useState } from "react";
import { fetchEmployeeAccessRequests } from "../services/accessRequestService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import Navbar from "../components/Navbar";

const EmployeeAccessRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const employeeId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchEmployeeAccessRequests(employeeId);
        setRequests(data);
      } catch (error) {
        console.error("Failed to load access requests:", error);
      }
    };
    loadRequests();
  }, [employeeId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <Navbar />
      <div className="flex justify-center items-center py-8">
        <Box
          component={Paper}
          elevation={6}
          sx={{
            padding: "20px",
            borderRadius: "12px",
            background: "#bbdefb",
            width: "80%",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: "#0d47a1", fontWeight: "bold" }}
          >
            My Access Requests
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(to right, #0d47a1, #1976d2)",
                  }}
                >
                  {["Service", "Permissions", "Project", "Expiry Date", "Status", "Approved By", "Approver Email",].map(
                    (header, index, array) => (
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
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <TableRow
                      key={req.id}
                      sx={{ "&:hover": { backgroundColor: "#f1faff" } }}
                    >
                      <TableCell align="center">{req.serviceType}</TableCell>
                      <TableCell align="center">{req.permissions}</TableCell>
                      <TableCell align="center">{req.projectName}</TableCell>
                      <TableCell align="center">
                        {new Date(req.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color:
                            req.status === "APPROVED"
                              ? "#2e7d32"
                              : req.status === "REJECTED"
                              ? "#d32f2f"
                              : "#ff9800",
                        }}
                      >
                        {req.status}
                      </TableCell>
                      <TableCell align="center">{req.approvedByName || "-"}</TableCell>
                      <TableCell align="center">{req.approvedByEmail || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                            No access requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </div>
  );
};

export default EmployeeAccessRequestsPage;