import { useContext } from "react";
import { UserContext } from "../Context";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children, adminonly }) => {
  const { user } = useContext(UserContext);

  if (user === undefined) return <div>Loading...</div>;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only check role for admin routes
  if (adminonly) {
    const allowedRoles = ["ADMIN", "SUPERADMIN"];

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default AuthRoute;