import { useContext } from "react";
import { UserContext } from "../Context";
import { Navigate } from "react-router-dom";
import Loader from "./comp/Loader/Loader";

const AuthRoute = ({ children, adminonly }) => {
  const { user, loader } = useContext(UserContext);

if (loader) {
  return <Loader />;
}

if (user === null) {
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