import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../services/employeeService";
import documentService from "../services/documentService"; // Import documentService
import Navbar from "../components/Navbar";
import ProfilePageSidebar from "../components/ProfilePageSidebar";
import PersonalDetails from "../components/PersonalDetails";

const ProfilePage = () => {

  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true); // Track profile completeness
  const id = localStorage.getItem("userId");
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        console.error("No user id found in localStorage!");
        return;
      }

      try {
        const data = await employeeService.fetchEmployeeDetails(id);
        if (!data) {
          console.error("Received empty data from API");
          return;
        }
        setEmployee(data);

        // Fetch document status to check profile completeness
        const documentStatus = await documentService.fetchDocumentStatus(id);
        const isComplete = Object.values(documentStatus).every(
          (status) => status === true
        );
        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error("Error fetching profile or document status:", error);
      }
    };
    fetchProfile();
  }, [id]);

  const handleEdit = () => {
    navigate(`/profile/edit/${id}`);
  };

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 font-semibold text-lg">
        Profile Loading...
      </div>
    );
  }

  // Render the section based on activeSection
  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalDetails employee={employee} />;

      default:
        return (
          <div className="text-gray-500 text-center py-8">
            Section under construction
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            background: "#bbdefb"
          //   border: isProfileComplete ? "none" : "2px solid red", // Add red border if profile is incomplete
          }}
        >
          <div className="flex flex-col md:flex-row">
            <ProfilePageSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              employee={employee}
            />
            <div className="flex-1">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeSection === "personal" ? "Profile" : "Profile"}
                  </h1>
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
                {!isProfileComplete && ( // Display warning if profile is incomplete
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Warning:</strong> Your profile is incomplete. Please
                    upload all mandatory documents.
                  </div>
                )}
                <div className="transition-all duration-200 ease-in-out">
                  {renderSection()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;