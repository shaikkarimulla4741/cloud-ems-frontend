import axios from "axios";
import API_BASE_URL from "./config";

/**
 * Verifies the user's email using the provided token.
 * @param {string} token - The email verification token.
 * @returns {Promise<string>} - Backend response message.
 */
const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/verify?token=${token}`);
    return response.data; // Return backend response message
  } catch (error) {
    return error.response?.data || "Invalid or expired verification link.";
  }
};

export default verifyEmail;