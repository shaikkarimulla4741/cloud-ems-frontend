import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from "./config";

/**
 * Logs in a user by sending their credentials to the server.
 * @param {Object} credentials - The login credentials (e.g., email and password).
 * @returns {Promise<Object>} - The response from the server.
 */


const login = async (credentials, navigate) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    localStorage.setItem("jwtToken", response.data);
    const token = jwtDecode(response.data);
    localStorage.setItem("userRole", token.role);
    localStorage.setItem("userId", token.id);
    localStorage.setItem("hasAuthority", token.hasAuthority);

    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      localStorage.setItem("resetPasswordRequired", true);
      navigate("/initial-password");
    } else if (error.response?.status === 401) {
      return Promise.reject("Invalid credentials. Please check your email and password.");
    } else {
      return Promise.reject(error.response?.data || "An error occurred during login.");
    }
  }
};


/**
 * Sends a request to reset the first-time login password.
 */
const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/initial-password`, {
      email,
      password: newPassword,
    });

    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to reset password." };
  }
};


/**
 * Sends a password reset request.
 * @param {string} email - The email of the user requesting password reset.
 * @returns {Promise<string>} - API response message.
 */
const sendForgotPasswordRequest = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/password/forgot`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending password reset request:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to send password reset request.");
  }
};


// Resetting the Forgot Password
const resetForgottenPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/password/reset?token=${token}`,
      { password: newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the success message
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw error.response?.data || { message: "An unexpected error occurred." };
  }
};

export default {
  login,
  resetPassword,
  sendForgotPasswordRequest,
  resetForgottenPassword,
};
