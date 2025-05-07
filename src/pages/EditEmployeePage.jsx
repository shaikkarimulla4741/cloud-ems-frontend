import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import employeeService from "../services/employeeService";
import Navbar from "../components/Navbar";
import EmployeeDocuments from "../components/EmployeeDocuments";

const EditEmployeePage = () => {
  const role = localStorage.getItem("userRole");
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    position: "",
    joiningDate: "",
    birthday: "",
  });

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const data = await employeeService.fetchEmployeeDetails(id);
        setFormData({
          name: data.name || "",
          email: data.email,
          phone: data.phone,
          role: data.role,
          department: data.department,
          position: data.position,
          joiningDate: data.joiningDate,
          birthday: data.birthday,
        });
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getEmployeeDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await employeeService.updateEmployee(id, formData);
      console.log("Employee updated successfully!");

      if (role === "HR" || role==="ADMIN") {
        navigate("/admin");
      } else if (role === "EMPLOYEE") {
        navigate("/profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating employee details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 ">
      <Navbar />

      <div className="flex items-center justify-center px-4 mt-16">
        <div
          className="bg-opacity-30 shadow-lg rounded-2xl p-10 w-full max-w-4xl backdrop-blur-md"
          style={{
            background: "linear-gradient(to bottom right, #bbdefb, #e3f2fd)",
          }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3 text-center">
            Edit Employee
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Name", name: "name", icon: <FaUser /> },
                { label: "Email", name: "email", icon: <FaEnvelope /> },
                { label: "Phone", name: "phone", icon: <FaPhone /> },
                { label: "Role", name: "role", icon: <FaBriefcase /> },
                { label: "Department", name: "department", icon: <FaBuilding /> },
                { label: "Position", name: "position", icon: <FaBriefcase /> },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                  <div className="relative">
                    {field.icon && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {field.icon}
                      </span>
                    )}
                    <input
                      type="text"
                      name={field.name}
                      placeholder={`Enter ${field.label}`}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              ))}

              {[
                { label: "Joining Date", name: "joiningDate" },
                { label: "Birthday", name: "birthday" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                  <input
                    type="date"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-2xl bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 pt-5 border-t mt-5">
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
              >
                Update Employee
              </button>
            </div>
          </form>

          <EmployeeDocuments employeeId={id} />
        </div>
      </div>
    </div>
  );
};

export default EditEmployeePage;