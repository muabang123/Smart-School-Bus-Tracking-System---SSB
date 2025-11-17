import React from "react";

import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

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
import AdminInfoPage from "./pages/admin/AdminInfo";
import DriverNotificationsPage from "./pages/drivers/Notifications";
import DriverMessagesPage from "./pages/drivers/Messages";


function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/sql/auth/login-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
      if (!res.ok) { const j = await res.json(); setError(j.message || 'Đăng nhập thất bại'); return }
      const j = await res.json()
      localStorage.setItem('authRole', j.role)
      localStorage.setItem('authUserId', j.userId)
      if (j.role === 'Driver') localStorage.setItem('driverId', j.userId)
      navigate(j.role === 'Admin' ? '/dashboard' : j.role === 'Driver' ? '/driver/dashboard' : j.role === 'Parent' ? '/parents/dashboard' : '/student/dashboard')
    } catch { setError('Không thể kết nối máy chủ') }
  }
  return (
    <div className="page-container">
      <h1 className="main-title">SMART SCHOOL BUS</h1>
      <div className="login-container">
        <h2 className="form-title">ĐĂNG NHẬP</h2>
        <form onSubmit={submit}>
          <div className="input-group">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input type="text" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button type="submit" className="login-button" style={{ textDecoration: "none", textAlign: "center" }}>
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}

function RequireAdmin({ children }) {
  const role = localStorage.getItem('authRole')
  if (role !== 'Admin') return <Navigate to="/" replace />
  return children
}

function RequireDriver({ children }) {
  const role = localStorage.getItem('authRole')
  if (role !== 'Driver') return <Navigate to="/" replace />
  return children
}

function RequireParent({ children }) {
  const role = localStorage.getItem('authRole')
  if (role !== 'Parent') return <Navigate to="/" replace />
  return children
}

function RequireStudent({ children }) {
  const role = localStorage.getItem('authRole')
  if (role !== 'Student') return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
      <Route path="/dashboard/admin-info" element={<RequireAdmin><AdminInfoPage /></RequireAdmin>} />

      <Route path="/dashboard/accounts" element={<RequireAdmin><Navigate to="/dashboard/accounts/parents" replace /></RequireAdmin>} />

      <Route path="/dashboard/accounts/parents" element={<RequireAdmin><AccountManagerPage /></RequireAdmin>} />

      <Route path="/dashboard/accounts/drivers" element={<RequireAdmin><DriverManagerPage /></RequireAdmin>} />

      <Route path="/login/driver" element={<LoginDrivers />} />

      <Route path="/driver/dashboard" element={<RequireDriver><DriverDashboard /></RequireDriver>} />

      <Route path="/driver/route/:routeId" element={<RouteDetailsPage />} />

      <Route path="/driver/schedule" element={<RequireDriver><WeeklySchedulePage /></RequireDriver>} />
      <Route path="/driver/notifications" element={<RequireDriver><DriverNotificationsPage /></RequireDriver>} />
      <Route path="/driver/messages" element={<RequireDriver><DriverMessagesPage /></RequireDriver>} />

      <Route path="/dashboard/students" element={<RequireAdmin><StudentManager /></RequireAdmin>} />

      <Route path="/login/parents" element={<LoginParents />} />

      <Route path="/dashboard/parents" element={<RequireAdmin><DashboardParents /></RequireAdmin>} />
      <Route path="/parents/dashboard" element={<RequireParent><DashboardParents /></RequireParent>} />
      <Route path="/student/dashboard" element={<RequireStudent><DashboardParents /></RequireStudent>} />

      <Route path="/tracking" element={<RequireAdmin><TheodoiXePage /></RequireAdmin>} />

      <Route path="/dashboard/notifications" element={<RequireAdmin><NotificationItem /></RequireAdmin>} />

      <Route path="/dashboard/schedules" element={<RequireAdmin><ScheduleManager /></RequireAdmin>} />

      <Route path="/dashboard/message" element={<RequireAdmin><ParentNotification /></RequireAdmin>} />

      <Route path="/dashboard/vehicles" element={<RequireAdmin><BusManagement /></RequireAdmin>} />

      <Route path="/dashboard/drivers" element={<RequireAdmin><DriverManager /></RequireAdmin>} />

      <Route path="/dashboard/routes" element={<RequireAdmin><RouteManagement /></RequireAdmin>} />
    </Routes>
  );
}

export default App;
