// DashboardRouteManagement.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import MainContent from '../../components/admin/RouteManagement';
import './Dashboard.css';

function DashboardRouteManagement() { 
     return (
         <div className="app">
            <Header />
            <div className="app-body">
              <Sidebar />
              <MainContent />
            </div>
         </div>
     );
}

export default DashboardRouteManagement;