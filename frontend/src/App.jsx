import React from "react";

import { Routes, Route, Link, Navigate } from "react-router-dom";

import "./styles.css";

import Dashboard from "./pages/admin/Dashboard";

import AccountManagerPage from "./pages/admin/AccountManager";

import DriverManagerPage from "./pages/admin/AccountDriverManager";

import LoginDrivers from "./pages/drivers/Login";

import DriverDashboard from "./pages/drivers/DriverDashBoard";

import RouteDetailsPage from "./pages/drivers/RouteDetailsPage";

import WeeklySchedulePage from "./pages/drivers/WeeklySchedule";

import StudentManager from "./pages/admin/StudentManager";

import LoginParents from "./pages/Parents/LoginPage";

import DashboardParents from "./pages/Parents/DashboardPage";

import TheodoiXePage from "./pages/Parents/theodoixe";

import NotificationItem from "./pages/admin/Notifications";

import ScheduleManager from "./pages/admin/ScheduleManager";

import ParentNotification from "./pages/admin/ParentNotification";

import BusManagement from "./pages/admin/BusManagement";

import DriverManager from "./pages/admin/DriverManager";

import RouteManagement from "./pages/admin/RouteManagement";


function LoginPage() {
  return (
    <div className="page-container">
      <h1 className="main-title">SMART SCHOOL BUS</h1>

      <div className="login-container">
        <h2 className="form-title">ĐĂNG NHẬP</h2>

        <form>
          <div className="input-group">
            <label htmlFor="username">Tên đăng nhập:</label>

            <input type="text" id="username" name="username" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mật khẩu:</label>

            <input type="password" id="password" name="password" />
          </div>

          <Link
            to="/dashboard"
            className="login-button"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Đăng Nhập
          </Link>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/dashboard/accounts"
        element={<Navigate to="/dashboard/accounts/parents" replace />}
      />

      <Route
        path="/dashboard/accounts/parents"
        element={<AccountManagerPage />}
      />

      <Route
        path="/dashboard/accounts/drivers"
        element={<DriverManagerPage />}
      />

      <Route path="/login/driver" element={<LoginDrivers />} />

      <Route path="/driver/dashboard" element={<DriverDashboard />} />

      <Route path="/driver/route/:routeId" element={<RouteDetailsPage />} />

      <Route path="/driver/schedule" element={<WeeklySchedulePage />} />

      <Route path="/dashboard/students" element={<StudentManager />} />

      <Route path="/login/parents" element={<LoginParents />} />

      <Route path="/dashboard/parents" element={<DashboardParents />} />

      <Route path="/tracking" element={<TheodoiXePage />} />

      <Route path="/dashboard/notifications" element={<NotificationItem />} />

      <Route path="/dashboard/schedules" element={<ScheduleManager />} />

      <Route path="/dashboard/message" element={<ParentNotification />} />

      <Route path="/dashboard/vehicles" element={<BusManagement />} />

      <Route path="/dashboard/drivers" element={<DriverManager />} />

      <Route path="/dashboard/routes" element={<RouteManagement />} />
    </Routes>
  );
}

export default App;
