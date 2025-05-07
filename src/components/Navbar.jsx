import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = () => {
  const location = useLocation();
  // Hide Register Employee button on /profile and /edit/:id
  const hideRegisterButton =
    location.pathname === "/profile" || location.pathname.startsWith("/profile/edit/");

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(to right, #0d47a1, #1976d2)",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        {/* Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, color: "white", fontWeight: "bold" }}>
          Employee Management
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;