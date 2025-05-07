import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCog,
  FaUsers,
  FaClock,
  FaChartLine,
  FaFileInvoice,
  FaBars,
  FaTimes,
  FaCalendarCheck,
  FaCalendarPlus,
  FaKey,
} from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  // const hasAuthority = localStorage.getItem("hasAuthority");

  const hasAuthority = localStorage.getItem("hasAuthority") === "true";

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div
      className={`transition-all duration-300 flex flex-col ${
        isOpen ? "w-64" : "w-16"
      } shadow-3xl`}
      style={{
        background: "#bbdefb",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar Toggle Button */}
      <button
        className="m-5 flex text-gray-600 hover:text-gray-900 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Search Bar */}
      {isOpen && (
        <div className="p-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <IoSearchOutline className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 bg-transparent focus:outline-none w-full"
            />
          </div>
        </div>
      )}

      {/* Sidebar Links */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {/* Admin (Only for HR/Admin) */}
          {(userRole === "HR" || userRole === "ADMIN") && (
            <SidebarItem
              icon={<FaUsers />}
              text="Admin"
              link="/admin"
              isOpen={isOpen}
            />
          )}

          {/* My Profile */}
          <SidebarItem
            icon={<FaChartLine />}
            text="My Profile"
            link="/profile"
            isOpen={isOpen}
          />

          {/* Leave Management (Single Option for Both) */}
          <SidebarItem
            icon={<FaCalendarCheck />}
            text="Leave Management"
            link={
              userRole === "HR" || userRole === "ADMIN"
                ? "/admin/leave-requests"
                : "/employees/leave-request"
            }
            isOpen={isOpen}
          />

          <SidebarItem
            icon={<FaKey />}
            text="Access Management"
            link={
              userRole === "HR" || userRole === "ADMIN" || hasAuthority
                ? "/all/access-requests"
                : "/access-request"
            }
            isOpen={isOpen}
          />
        </ul>
      </nav>

      {/* Logout Button */}
      <button className="bottom-4 px-4 mb-2" onClick={handleLogout}>
        <SidebarItem icon={<FaFileInvoice />} text="Logout" isOpen={isOpen} />
      </button>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, link, isOpen }) => (
  <Link
    to={link}
    className="flex items-center p-3 text-gray-700 hover:bg-orange-100 rounded-lg transition"
  >
    <span className="text-lg">{icon}</span>
    <span className={`ml-3 ${isOpen ? "block" : "hidden"} transition`}>
      {text}
    </span>
  </Link>
);

export default Sidebar;
