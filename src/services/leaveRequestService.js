import axios from "axios";
import API_BASE_URL from "./config"; // Ensure API_BASE_URL is correctly set

const submitLeaveRequest = async (leaveRequest) => {
  const token = localStorage.getItem("jwtToken");
  let employeeId = localStorage.getItem("userId");

  if (!employeeId) {
    throw new Error("Employee ID is missing. Please log in again.");
  }

  employeeId = Number(employeeId); // Ensure it's a number

  try {
    const response = await axios.post(
      `${API_BASE_URL}/submit-leave-request`,
      leaveRequest,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Employee-ID": employeeId, // Pass Employee ID for Authorization
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting leave request:", error);
    throw error;
  }
};


// Fetch logged-in employee's leave requests
const fetchEmployeeLeaveRequests = async () => {

  const employeeId = Number(localStorage.getItem("userId"));
  
  if (!employeeId) throw new Error("User ID not found or invalid");

  try {
    const response = await axios.get(
      `${API_BASE_URL}/${employeeId}/leave-requests`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employee leave requests:", error);
    throw error;
  }
};

// Fetch all leave requests (for HR/Admin)
const fetchAllLeaveRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leave-requests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all leave requests:", error);
    throw error;
  }
};

// Update leave request status (approve/reject)
const updateLeaveStatus = async (id, status) => {
  try {
    await axios.put(`${API_BASE_URL}/leave-request/${id}/status`, null, {
      params: { status },
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    throw error;
  }
};

// Fetch Leave Balance for the Employee
const fetchLeaveBalance = async (employeeId) => {
  const token = localStorage.getItem("jwtToken");
  // let employeeId = localStorage.getItem("userId");

  if (!employeeId) {
    throw new Error("Employee ID is missing. Please log in again.");
  }

  // if (!token) {
  //   throw new Error("JWT token is missing. Please log in again.");
  // }

  employeeId = Number(employeeId);

  try {
    const response = await axios.get(`${API_BASE_URL}/leave-balance`, {
      headers: { 
        "Authorization": `Bearer ${token}`,  // ✅ Add JWT token
        "X-Employee-ID": employeeId          // ✅ Keep employee ID
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    throw error;
  }
};

const fetchLeaveBalancesAdmin = async (employeeIds) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/leave-balances`, {
      params: { 
        employeeIds: employeeIds.join(',') // Convert array to comma-separated string
      },
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}` 
      },
      paramsSerializer: params => {
        // Custom serializer to handle array->comma conversion
        return Object.keys(params)
          .map(key => `${key}=${params[key]}`)
          .join('&');
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching balances:", error);
    return {};
  }
};

// const fetchLeaveBalancesAdmin = async (employeeIds) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/admin/leave-balances`, {
//       params: { employeeIds },
//       headers: { 
//         Authorization: `Bearer ${localStorage.getItem("jwtToken")}` 
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//     return {};
//   }
// };

export {
  submitLeaveRequest,
  fetchEmployeeLeaveRequests,
  fetchAllLeaveRequests,
  updateLeaveStatus,
  fetchLeaveBalance,
  fetchLeaveBalancesAdmin,
};