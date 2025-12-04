import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./components/Auth/Login/Login";
import SignUp from "./components/Auth/Signup/SignUp";
import UserDashboard from "./components/User/UserDashboard/UserDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard/AdminDashboard.jsx";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard/SuperAdminDashboard.jsx";
import Resolutions from "./components/Admin/Resolutions/Resolutions.jsx";
import AdminChatBot from "./components/Admin/AdminChatBot/AdminChatBot.jsx";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes Super User */}

        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute
              element={SuperAdminDashboard}
              allowedRoles={["SuperAdmin"]}
            />
          }
        />

        {/* Protected Routes Admin*/}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute element={AdminDashboard} allowedRoles={["admin"]} />
          }
        />

        <Route
          path="/resolutions"
          element={
            <ProtectedRoute element={Resolutions} allowedRoles={["admin"]} />
          }
        />

        {/* Protected Routes User*/}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute element={UserDashboard} allowedRoles={["user"]} />
          }
        />

        <Route
          path="/admin-chatBot"
          element={
            <ProtectedRoute element={AdminChatBot} allowedRoles={["admin"]} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
