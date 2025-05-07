// This Code is without the Employee Leave Indication
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../services/employeeService";
import documentService from "../services/documentService";
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
} from "@mui/material";

const AdminPage = () => {
  const [employees, setEmployees] = useState([]);
  const [documentStatus, setDocumentStatus] = useState({}); // Track document status for each employee
  const navigate = useNavigate();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await employeeService.fetchEmployees();
        setEmployees(data);

        // Fetch document status for each employee
        const statusMap = {};
        for (const emp of data) {
          const status = await documentService.fetchDocumentStatus(emp.id);
          statusMap[emp.id] = status;
        }
        setDocumentStatus(statusMap);
      } catch (error) {
        console.error("Failed to fetch employees or document status", error);
      }
    };
    loadEmployees();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(id);
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (error) {
        console.error("Failed to delete employee", error);
      }
    }
  };

  // Check if all mandatory documents are uploaded for an employee
  const isProfileComplete = (employeeId) => {
    const status = documentStatus[employeeId];
    if (!status) return false;

    return Object.values(status).every((docStatus) => docStatus === true);
  };

  return (
    <div
      className="bg-gradient-to-br from-blue-100 to-blue-50"
      style={{ minHeight: "100vh", paddingBottom: "20px" }}
    >
      <Navbar />
      <div className="container mx-auto py-8 ">
        <Box
          component={Paper}
          elevation={6}
          sx={{
            padding: "20px",
            borderRadius: "12px",
            background: " #bbdefb",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginLeft: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "16px",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/employees/register")}
              sx={{
                background: "white",
                color: "#1565c0",
                fontWeight: "bold",
                borderRadius: "8px",
                "&:hover": { background: "#f0f0f0" },
              }}
            >
              Add Employee
            </Button>
          </Box>

          <TableContainer
            sx={{
              background: "transparent",
              borderRadius: "12px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(to right, #0d47a1, #1976d2)",
                  }}
                >
                  {[
                    "ID",
                    "Name",
                    "Email",
                    "Phone",
                    "Role",
                    "Department",
                    "Position",
                    "Joining Date",
                    "Birthday",
                    "Documents",
                    "Actions",
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
                {employees.map((emp) => (
                  <TableRow
                    key={emp.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f1faff" },
                      // backgroundColor: emp.onLeave ? "#fdd835" : "inherit", // Yellow highlight for on-leave employees
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                      {emp.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontSize: "16px",
                        color: isProfileComplete(emp.id) ? "inherit" : "red",
                        fontWeight: isProfileComplete(emp.id)
                          ? "normal"
                          : "bold",
                      }}
                    >
                      {emp.name} {!isProfileComplete(emp.id) && " (Incomplete)"}{" "}
                      {emp.onLeave && (
                        <Typography
                          component="span"
                          sx={{ color: "red", fontWeight: "bold" }}
                        >
                          (On Leave)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                      {emp.email}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                      {emp.phone}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {emp.role}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {emp.department}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontStyle: "italic" }}
                    >
                      {emp.position}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                      {emp.joiningDate}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                      {emp.birthday}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {emp.documents.length > 0 ? (
                        emp.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#1976d2",
                              textDecoration: "none",
                              fontWeight: "bold",
                              display: "block",
                              marginBottom: "5px",
                            }}
                          >
                            {doc.fileName}
                          </a>
                        ))
                      ) : (
                        <Typography color="gray">No documents</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button onClick={() => handleEdit(emp.id)}>✏️</Button>
                      <Button onClick={() => handleDelete(emp.id)}>🗑️</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </div>
  );
};

export default AdminPage;