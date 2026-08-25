import { useContext } from "react";
import { UserContext } from "../Context";
import { Navigate } from "react-router-dom";
import Loader from "./comp/Loader/Loader";

const AuthRoute = ({
  children,
  adminonly = false,
  employeeonly = false,
}) => {
  const { user, loader } = useContext(UserContext);


  if (loader) {
    return <Loader />;
  }


  if (user === null || !user) {
    return <Navigate to="/login" replace />;
  }


  const role = String(user?.role || "")
    .trim()
    .toUpperCase();

  console.log("USER:", user);
  console.log("USER ROLE:", role);
  console.log("ADMIN ONLY:", adminonly);
  console.log("EMPLOYEE ONLY:", employeeonly);

  if (adminonly) {
    const allowedRoles = ["ADMIN", "SUPERADMIN"];

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/Empdashboard" replace />;
    }
  }

  if (employeeonly) {
    const allowedEmployeeRoles = ["EMPLOYEE"];

    if (!allowedEmployeeRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }


  return children;
};

export default AuthRoute;