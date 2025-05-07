import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import documentService from "../services/documentService";

const REQUIRED_DOCUMENTS = ["NDA Form", "Offer Letter", "Resume", "Bank Details", "PAN Card"];

const EmployeeDocuments = ({ employeeId }) => {
  const [documents, setDocuments] = useState([]); // Uploaded documents
  const [selectedFiles, setSelectedFiles] = useState({}); // Selected files before upload
  const [uploadedStatus, setUploadedStatus] = useState({}); // Upload status from backend

  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments(); // Fetch uploaded documents
    fetchDocumentStatus(); // Fetch mandatory document status
  }, [employeeId]);

  // Fetch uploaded documents
  const fetchDocuments = async () => {
    try {
      const updatedDocs = await documentService.fetchEmployeeDocuments(employeeId);
      setDocuments(updatedDocs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Fetch mandatory document status from backend
  const fetchDocumentStatus = async () => {
    try {
      const status = await documentService.fetchDocumentStatus(employeeId);
      setUploadedStatus(status);
    } catch (error) {
      console.error("Error fetching document status:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e, docName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Ensure the selected file matches the required document name
    if (!file.name.toLowerCase().includes(docName.toLowerCase())) {
      alert(`Invalid file name! Please select the correct document: ${docName}`);
      return;
    }

    setSelectedFiles((prev) => ({
      ...prev,
      [docName]: file,
    }));

    // Set status to "selected" (yellow)
    setUploadedStatus((prev) => ({
      ...prev,
      [docName.toUpperCase().replace(" ", "_")]: "selected",
    }));
  };

  // Handle file upload
  const handleUpload = async (docName) => {
    if (!selectedFiles[docName]) return;

    try {
      // Convert docName to documentType format (e.g., "NDA Form" -> "NDA_FORM")
      const documentType = docName.toUpperCase().replace(" ", "_");

      // Upload the file with documentType
      await documentService.uploadDocument(employeeId, selectedFiles[docName], documentType);

      // Refresh documents and status
      await fetchDocuments();
      await fetchDocumentStatus();

      // Remove from selected files
      setSelectedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[docName];
        return newFiles;
      });

      alert(`${docName} uploaded successfully!`);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  // Handle document deletion
  const handleDelete = async (documentId, docName) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;

    try {
      await documentService.deleteDocument(documentId);
      await fetchDocuments(); // Refresh documents
      await fetchDocumentStatus(); // Refresh status
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Mandatory Documents</h3>

      {/* Required Documents Checklist */}
      <ul className="mb-4">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const status = uploadedStatus[doc.toUpperCase().replace(" ", "_")];
          return (
            <li
              key={doc}
              className={`text-sm font-medium ${
                status === true ? "text-green-600" : status === "selected" ? "text-yellow-500" : "text-red-600"
              }`}
            >
              {status === true ? "✔" : status === "selected" ? "⚠" : "✖"} {doc}
            </li>
          );
        })}
      </ul>

      {/* Upload Section */}
      <div className="space-y-3">
        {REQUIRED_DOCUMENTS.map((doc) => (
          <div key={doc} className="flex items-center space-x-3">
            <input type="file" onChange={(e) => handleFileChange(e, doc)} className="border p-2 rounded-md text-sm" />
            <button
              onClick={() => handleUpload(doc)}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                selectedFiles[doc] ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!selectedFiles[doc]}
            >
            {doc}
            </button>
          </div>
        ))}
      </div>

      {/* Uploaded Documents List */}
      <h3 className="text-lg font-bold mt-6 text-gray-800">Uploaded Documents</h3>
      <ul className="mt-2 space-y-2">
        {documents.map((doc) => {
          const isMatching = REQUIRED_DOCUMENTS.some(
            (requiredDoc) => requiredDoc.toLowerCase() === doc.fileName.toLowerCase()
          );

          return (
            <li
              key={doc.id}
              className={`flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md ${
                isMatching ? "text-green-600" : "text-gray-800"
              }`}
            >
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium">
                {doc.fileName}
              </a>
              <button
                onClick={() => handleDelete(doc.id, doc.fileName)}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EmployeeDocuments;
