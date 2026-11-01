import React, { useState, useContext, useEffect } from 'react';
import { getAuth } from '../utils/Auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false); // Added dedicated employee flag
  const [isCustomer, setIsCustomer] = useState(false);
  const [userProfile, setUserProfile] = useState(null); 

  // Helper function to map all role flags cleanly
  const setRoleStates = (role, profileData) => {
    setIsLogged(true);
    setUserProfile(profileData);
    
    // Explicitly separate permissions based on strings sent by backend
    setIsAdmin(role === 'admin');
    setIsEmployee(role === 'employee'); // Checks if role is 'employee'
    setIsCustomer(role === 'customer');
  };

  const clearAuthStates = () => {
    setIsLogged(false);
    setIsAdmin(false);
    setIsEmployee(false);
    setIsCustomer(false);
    setUserProfile(null);
  };

  useEffect(() => {
    const response = getAuth();
    if (response && response.token) {
      setRoleStates(response.role, response);
    }
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      
      const profileData = {
        token: token,
        role: decoded?.role || null,
        id: decoded?.id || null
      };

      setRoleStates(profileData.role, profileData);
    } catch (error) {
      console.error("Invalid token passed to login handler:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    clearAuthStates();
  };

  const value = { 
    isLogged, 
    isAdmin, 
    isEmployee, // Exposed to the app
    isCustomer, 
    userProfile,
    login, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
