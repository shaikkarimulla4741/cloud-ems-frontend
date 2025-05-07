import React from "react";
import FormField from "./FormField";

const PersonalDetails = ({ employee }) => {
  // Destructure the employee data to make it easier to work with
  const {
    id,
    name,
    email,
    phone,
    role,
    department,
    position,
    joiningDate,
    birthday,
    documents = [],
  } = employee || {};

  return (
    <div className="mx-auto p-20 shadow-lg rounded-2xl"style={{
      background: " #e3f2fd",
    }}>
      {/* <div className="mb-8"> */}
        {/* <h2 className="text-2xl font-semibold text-gray-900">
          Personal Details
        </h2> */}
        {/* <p className="text-xl text-gray-500 mt-1">
          Manage your personal information
        </p> */}
      {/* </div> */}

      {/* Grid layout for form fields */}
      <div className="grid grid-cols-2 gap-6">
        <FormField label="ID" value={id} required />
        <FormField label="Name" value={name} required />
        <FormField label="Email" value={email} required type="email" />
        <FormField label="Phone" value={phone} required />
        <FormField label="Role" value={role} required hasDropdown />
        <FormField label="Department" value={department} required hasDropdown />
        <FormField label="Position" value={position} required />
        <FormField
          label="Joining Date"
          value={joiningDate}
          required
          hasCalendar
        />
        <FormField label="Birthday" value={birthday} required hasCalendar />
      </div>

      {/* Documents Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
        {documents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc.id} className="py-3">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  {doc.fileName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No documents available</p>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;
