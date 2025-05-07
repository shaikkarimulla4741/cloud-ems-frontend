import axios from "axios";
import API_BASE_URL from "./config";

const submitAccessRequest = async (accessRequest) => {
  const token = localStorage.getItem("jwtToken");
  const employeeId = Number(localStorage.getItem("userId"));

  try {
    const response = await axios.post(
      `${API_BASE_URL}/access-request/submit`,
      accessRequest,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Employee-ID": employeeId,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting access request:", error);
    throw error;
  }
};

const fetchEmployeeAccessRequests = async (employeeId) => {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await axios.get(
      `${API_BASE_URL}/${employeeId}/access-request`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching access requests:", error);
    throw error;
  }
};

const fetchAllAccessRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/access-request/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all access requests:", error);
    throw error;
  }
};

const updateAccessStatus = async (id, status) => {
  try {
    await axios.put(`${API_BASE_URL}/access-request/${id}/status`, null, {
      params: { status },
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
  } catch (error) {
    console.error("Error updating access status:", error);
    throw error;
  }
};

export {
  submitAccessRequest,
  fetchEmployeeAccessRequests,
  fetchAllAccessRequests,
  updateAccessStatus,
};
