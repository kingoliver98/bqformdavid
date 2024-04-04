import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation()

  return token ? children : <Navigate to="/signin" state={{from: location}} replace/>;
};

export default PrivateRoute;
