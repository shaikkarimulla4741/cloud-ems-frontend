import axios from "axios";
import API_BASE_URL from "./config";


// Registering the employees
const registerEmployee = async (employeeData) => {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response; // Return full response to the caller
  } catch (error) {
    throw error; // Throw error so the caller can handle it
  }
};

// Fetching all employees
const fetchEmployees = async () => {
  const token = localStorage.getItem("jwtToken");
  const response = await axios.get(`${API_BASE_URL}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Removing the employee from database
const deleteEmployee = async (id) => {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}/remove`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// fetch sepcific employee with id
const fetchEmployeeDetails = async (id) => {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await axios.get(
      `${API_BASE_URL}/${id}/details`,  // Ensure correct API URL
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("API Response:", response); // Log entire response
    console.log("Employee Data:", response.data); // Log data

    return response.data; // Return response data correctly
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};



// Update employee details
const updateEmployee = async (id, formData) => {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/update`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};


export default { registerEmployee, fetchEmployees, updateEmployee, deleteEmployee, fetchEmployeeDetails };