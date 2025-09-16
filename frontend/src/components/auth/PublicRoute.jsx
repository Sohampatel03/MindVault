// src/components/auth/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth(); // assuming your AuthContext provides `user`

  if (user) {
    // ✅ If already logged in, prevent access to login/register
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ If not logged in, render the public page
  return children;
};

export default PublicRoute;
