import { jwtDecode } from 'jwt-decode';

export const getAuth = () => {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      
      // FIX: Extract 'role' directly from the decoded payload object
      return {
        token: token,
        role: decoded?.role || null, 
        id: decoded?.id || null
      };
    } catch (error) {
      console.error("Failed to decode token", error);
      return null;
    }
  }
  return null;
};
