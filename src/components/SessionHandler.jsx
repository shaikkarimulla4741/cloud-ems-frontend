import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SessionHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("jwtToken");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // ✅ Prevent navigating back to the login page if logged in
    if (token && location.pathname === "/login") {
      if (userRole === "HR" || userRole === "ADMIN") {
        navigate("/admin", { replace: true }); // Replace login in history
      } else if (userRole === "EMPLOYEE") {
        navigate("/profile", { replace: true }); // Replace login in history
      }
    }

    // ✅ Token Expiration Check
    const checkTokenExpiration = () => {
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          // Token expired, log out user and redirect to login
          localStorage.clear();
          alert("Session Expired, Please Login Again!");
          navigate("/login", { replace: true });
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Check every 1 min

    return () => {
      clearInterval(interval);
    };
  }, [location, navigate, userRole, token]);

  return null;
};

export default SessionHandler;
