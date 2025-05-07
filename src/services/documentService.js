import axios from "axios";
import API_BASE_URL from "./config";

const documentService = {
  // Upload a document for an employee with documentType
  uploadDocument: async (employeeId, file, documentType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType); // Add documentType

    const token = localStorage.getItem("jwtToken");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/${employeeId}/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  // Fetch all documents for an employee
  fetchEmployeeDocuments: async (employeeId) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${employeeId}/documents/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  // Delete a document by documentId
  deleteDocument: async (documentId) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.delete(
        `${API_BASE_URL}/documents/${documentId}/remove`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  // Fetch mandatory document status for an employee
  fetchDocumentStatus: async (employeeId) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${employeeId}/document-status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Returns a map like { "NDA_FORM": true, "OFFER_LETTER": false, ... }
    } catch (error) {
      console.error("Error fetching document status:", error);
      throw error;
    }
  },
};

export default documentService;