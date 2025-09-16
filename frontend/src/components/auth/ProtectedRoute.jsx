// src/components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // if no user, redirect to landing page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
