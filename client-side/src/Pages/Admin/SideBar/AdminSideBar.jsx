// src/Pages/Admin/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext';
import { 
  FaChartPie, FaBoxOpen, FaUsers, FaUserTie, FaGear, 
  FaRightFromBracket, FaUserShield 
} from 'react-icons/fa6';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin-dashboard', label: 'Overview', icon: <FaChartPie /> },
    { path: '/admin-dashboard/products', label: 'Products & Orders', icon: <FaBoxOpen /> },
    { path: '/admin-dashboard/users', label: 'User Accounts', icon: <FaUsers /> },
    { path: '/admin-dashboard/employees', label: 'Manage Employees', icon: <FaUserTie /> },
    { path: '/admin-dashboard/settings', label: 'Settings', icon: <FaGear /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shadow-sm h-full">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1 text-indigo-600 font-bold border-b border-slate-100 pb-4">
          <FaUserShield className="text-xl" />
          <span className="tracking-wide uppercase text-sm">Admin Control</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'} // Prevents highlighting overview on sub-routes
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer mt-auto"
      >
        <FaRightFromBracket className="text-base" />
        Log Out
      </button>
    </aside>
  );
};

export default AdminSidebar;
