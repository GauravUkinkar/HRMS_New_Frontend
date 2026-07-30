import { useContext } from 'react'
import { UserContext } from '../Context';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (user === undefined) return <div>Loading...</div>;

  const allowedRoles = ["ADMIN", "SUPERADMIN"];

  if (!user || !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
