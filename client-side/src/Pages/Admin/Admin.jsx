// src/Pages/Admin/Admin.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { FaBell } from 'react-icons/fa6';
import AdminSidebar from './SideBar/AdminSideBar';

const Admin = () => {
  const { userProfile } = useAuth();

  return (
    // FIX: Set a strict max height subtracting the main header height (64px / 16)
    <div className="flex h-[calc(100vh-64px)] w-full bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* 1. Sidebar is now naturally pinned to the full height of this viewport wrapper */}
      <AdminSidebar />

      {/* 2. Main Workspace Layout */}
      <div className="flex-grow flex flex-col min-w-0 h-full">
        
        {/* Workspace Top Header Bar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm flex-shrink-0">
          <h1 className="text-xl font-bold text-slate-800">Control Panel</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative rounded-lg hover:bg-slate-50">
              <FaBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              ID: {userProfile?.id || 'System'}
            </span>
          </div>
        </header>

        {/* 3. Independent Scrollable Sub-page Area (Footer is removed inside this zone) */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet /> 
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default Admin;
