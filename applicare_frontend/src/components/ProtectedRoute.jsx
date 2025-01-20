// src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from '../context/auth/AuthContext'

// this component is used to protect routes that require authentication,
// meaning that if the user accesses them without being authenticated,
// they will be redirected to the login page. 

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    
    if (!user) {
      // goto landing page if user is not authenticated
      return <Navigate to="/" />;
    }
    
    return children;
  }
  
  export default ProtectedRoute;