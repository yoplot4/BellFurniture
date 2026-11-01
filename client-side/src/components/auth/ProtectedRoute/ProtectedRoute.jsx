import React, {useState, useEffect, use} from 'react';
import { Navigate } from "react-router-dom";
import { getAuth } from '../../../utils/Auth';

const ProtectedRoute = ({allowedRoles, children}) => {
  const [ auth, setAuth] = useState(null);

  useEffect(()=>{
    const checkAuth = async ()=>{
      const response= await getAuth();
      setAuth(response);
    };
    checkAuth()
  },[])
  if(auth === null){
    return <div>Loading...</div>
  }
  if (!auth.token){
    return <Navigate to="/login" replace/>
  }
  if (!allowedRoles.includes(auth.role)){
    return <Navigate to="/unauthorized" replace/>
  }
  return children
}

export default ProtectedRoute
