import React from "react";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children, roles }) => {
  const isAuthenticated = !!localStorage.getItem("jwtToken");
  // const userRole = localStorage.getItem("userRole");
  const userRole = localStorage.getItem("userRole")?.toUpperCase();

  const hasAuthority = localStorage.getItem("hasAuthority") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !(roles.includes(userRole) || hasAuthority)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default PrivateRoute;
