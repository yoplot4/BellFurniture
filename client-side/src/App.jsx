import React from "react";
import { Routes, Route } from "react-router-dom";

import Headers from "./components/Header/Headers";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/auth/Login/Login";
import Signup from "./components/auth/SignUp/SignUp";
import UnAuthorized from "./UnAuthorized";
import AuthProvider from "./Contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute/ProtectedRoute";
import Admin from "./Pages/Admin/Admin";
import AdminOverview from "./Pages/Admin/AdminOverview/AdminOverview";
import ManageEmployees from "./Pages/Admin/ManageEmployees/ManageEmployees";
import ManageProducts from "./Pages/Admin/ManageProducts/ManageProducts";
import ManageUser from "./Pages/Admin/ManageUser/ManageUser";
import AdminSettings from "./Pages/Admin/AdminSettings/AdminSettings";
import Customer from "./Pages/Customer/Customer";

function App() {
  return (
    // overflow-x-hidden acts as an unbreachable wall against sideways scrolling
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 font-sans flex flex-col justify-between">
      <AuthProvider>
      
      
      {/* Header section always visible */}
      <Headers />

      {/* Main Content Area based on Route */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<UnAuthorized/>} />
          {/** Protected Routes  */}
          {/** Admin Routes  */}
          <Route path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin/>
              </ProtectedRoute>
            }
          >
            {/** Child  Routes that fill the<Outlet/> in Admin.jsx */}
            <Route index element={<AdminOverview />} /> {/* /admin */}
            <Route path="products" element={<ManageProducts />} /> {/* /admin/products */}
            <Route path="users" element={<ManageUser />} /> {/* /admin/users */}
            <Route path="employees" element={<ManageEmployees />} /> {/* /admin/employees */}
            <Route path="settings" element={<AdminSettings />} /> {/* /admin/settings */}
          </Route>

           {/** Customer Routes  */}
          <Route path="/customer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Customer/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer section always visible */}
      <Footer />
      </AuthProvider>
      
    </div>
  );
}

export default App;