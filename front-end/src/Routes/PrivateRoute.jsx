/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../GlobalContext/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <h1>Please wait...</h1>;
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
