import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import type { DecodedAccessToken } from '../interfaces/interfaces';

const PrivateRoute = () => {
  const { accessToken, logout } = useAuth();
  const [isExpired, setIsExpired] = useState(false);
  const [user, setUser] = useState<DecodedAccessToken | null>(null);

  // Decode the token safely inside useEffect or conditionally
  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode<DecodedAccessToken>(accessToken);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
        setIsExpired(true);
      }
    }
  }, [accessToken, logout]);

  // Check expiration in a separate effect
  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      if (user.exp && (Date.now() / 1000) > user.exp) {
        logout();
        setIsExpired(true);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60 * 1000);
    return () => clearInterval(interval);
  }, [user, logout]);

  // Now handle redirects AFTER hooks
  if (!accessToken || isExpired) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute
