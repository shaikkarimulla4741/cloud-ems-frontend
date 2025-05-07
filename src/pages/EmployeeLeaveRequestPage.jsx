import React, { useEffect, useState } from "react";
import { fetchEmployeeLeaveRequests } from "../services/leaveRequestService";
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

const EmployeeLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  
  // ✅ Fix applied: Ensuring parsed data is always an array
  const [seenLeaves, setSeenLeaves] = useState(() => {
    try {
      const storedLeaves = localStorage.getItem("seenLeaves");
      return new Set(storedLeaves ? JSON.parse(storedLeaves) || [] : []);
    } catch (error) {
      console.error("Error parsing seenLeaves from localStorage:", error);
      return new Set();
    }
  });

  useEffect(() => {
    const getLeaves = async () => {
      try {
        const data = await fetchEmployeeLeaveRequests();
        console.log("Fetched Leaves:", data);
  
        setLeaveRequests(data); // ✅ Don't filter out seen/approved leaves
  
        // You can still track seen leaves if you want, but it's optional now
        const updatedSeenLeaves = new Set(seenLeaves);
        data.forEach((req) => {
          if (req.status !== "PENDING") {
            updatedSeenLeaves.add(req.id);
          }
        });
  
        localStorage.setItem(
          "seenLeaves",
          JSON.stringify(Array.from(updatedSeenLeaves))
        );
        setSeenLeaves(updatedSeenLeaves);
      } catch (error) {
        console.error("Failed to fetch leave requests", error);
      }
    };
  
    getLeaves();
  }, []);

  
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
            My Leave Requests
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(to right, #0d47a1, #1976d2)",
                  }}
                >
                  {["Start Date", "End Date", "Type", "Status"].map(
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
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((req) => (
                    <TableRow
                      key={req.id}
                      sx={{ "&:hover": { backgroundColor: "#f1faff" } }}
                    >
                      <TableCell align="center">{req.startDate}</TableCell>
                      <TableCell align="center">{req.endDate}</TableCell>
                      <TableCell align="center">{req.type}</TableCell>
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No leave requests found
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

export default EmployeeLeaveRequests;