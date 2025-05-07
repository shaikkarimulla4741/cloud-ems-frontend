import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate, // Import Navigate
} from "react-router-dom";
import VerifyEmailPage from "./pages/EmailVerificationPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import EditEmployee from "./pages/EditEmployeePage";
import RegisterEmployeePage from "./pages/RegisterEmployeePage";
import LeaveRequestPage from "./pages/LeaveRequestPage";
import AdminLeaveRequests from "./pages/AdminLeaveRequestsPage";
import EmployeeLeaveRequests from "./pages/EmployeeLeaveRequestPage";
import AccessRequestPage from "./pages/AccessRequestPage";
import EmployeeAccessRequestsPage from "./pages/EmployeeAccessRequestPage";
import AllAccessRequestsPage from "./pages/AllAccessRequestsPage";
import InitialResetPasswordPage from "./pages/InitialResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetForgotPassword from "./pages/ResetForgotPasswordPage";
import ForbiddenPage from "./pages/403Page";
import NotFoundPage from "./pages/404Page";
import PrivateRoute from "./components/PrivateRoute";
import SessionHandler from "./components/SessionHandler";
import Sidebar from "./components/Sidebar";
// import EmployeeAccessRequestsPage from "./pages/EmployeeAccessRequestPage";

// Layout Component with Sidebar (Only for Non-Login Pages)
const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login"; // Hide sidebar only on Login Page

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />} {/* Show Sidebar Only if Not on Login */}
      <div className="flex-grow">{children}</div>
    </div>
  );
};

// Wrapper component to apply layout to protected routes
const ProtectedRouteWithLayout = ({ children, roles }) => {
  return (
    <PrivateRoute roles={roles}>
      <Layout>{children}</Layout>
    </PrivateRoute>
  );
};

const App = () => (
  <Router>
    <SessionHandler /> {/* Automatically logs out expired sessions */}
    <Routes>
      {/* Redirect root path to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Route for Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Verification Page  */}
      <Route path="/verify" element={<VerifyEmailPage />} />

      {/* Private Route for Admin Page (Only HR and ADMIN) */}
      <Route
        path="/admin"
        element={
          <ProtectedRouteWithLayout roles={["HR", "ADMIN"]}>
            <AdminPage />
          </ProtectedRouteWithLayout>
        }
      />

      {/* Private Route for Edit Employee Data (Only HR and ADMIN) */}
      <Route
        path="/admin/edit/:id"
        element={
          <ProtectedRouteWithLayout roles={["HR", "ADMIN"]}>
            <EditEmployee />
          </ProtectedRouteWithLayout>
        }
      />

      {/* Private Route for Profile Edit */}
      <Route
        path="/profile/edit/:id"
        element={
          <ProtectedRouteWithLayout>
            <EditEmployee />
          </ProtectedRouteWithLayout>
        }
      />

      {/* Private Route for Register Employee (Only HR and ADMIN) */}
      <Route
        path="/employees/register"
        element={
          <ProtectedRouteWithLayout roles={["HR", "ADMIN"]}>
            <RegisterEmployeePage />
          </ProtectedRouteWithLayout>
        }
      />

      {/* Private Route for Employee Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRouteWithLayout>
            <ProfilePage />
          </ProtectedRouteWithLayout>
        }
      />

      <Route
        path="/employees/leave-request"
        element={
          <ProtectedRouteWithLayout roles={["HR", "ADMIN", "EMPLOYEE"]}>
            <LeaveRequestPage />
          </ProtectedRouteWithLayout>
        }
      />

      <Route
        path="/employees/my-leave-requests"
        element={
          <ProtectedRouteWithLayout roles={["EMPLOYEE", "HR", "ADMIN"]}>
            <EmployeeLeaveRequests />
          </ProtectedRouteWithLayout>
        }
      />

      <Route
        path="/admin/leave-requests"
        element={
          <ProtectedRouteWithLayout roles={["HR", "ADMIN"]}>
            <AdminLeaveRequests />
          </ProtectedRouteWithLayout>
        }
      />

      <Route
        path="/access-request"
        element={
          <ProtectedRouteWithLayout roles={["HR", "ADMIN", "EMPLOYEE"]}>
            <AccessRequestPage />
          </ProtectedRouteWithLayout>
        }
      />

      <Route
        path="/employees/my-access-requests"
        element={
          <ProtectedRouteWithLayout roles={["HR", "ADMIN", "EMPLOYEE"]}>
            <EmployeeAccessRequestsPage />
          </ProtectedRouteWithLayout>
        }
      />

      <Route
        path="/all/access-requests"
        element={
          <ProtectedRouteWithLayout roles={["HR", "ADMIN"]}>
            <AllAccessRequestsPage />
          </ProtectedRouteWithLayout>
        }
      />

      {/* Public Route for Initial Password Reset */}
      <Route path="/initial-password" element={<InitialResetPasswordPage />} />

      {/* Public Route for Forgot Password */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Public Route for Reset Forgot Password */}
      <Route path="/reset-forgot-password" element={<ResetForgotPassword />} />

      {/* 403 Forbidden Page */}
      <Route path="/403" element={<ForbiddenPage />} />

      {/* 404 Not Found Page - This should be at the end */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default App;
