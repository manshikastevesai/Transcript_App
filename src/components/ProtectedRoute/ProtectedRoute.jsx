import { Navigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import Loading from "../CommonComponent/Loading/Loading";

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const { user, isLoading } = useAppContext();
  if (isLoading) return <Loading />;

  if (!user || !user.access_token) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role))
    return <Navigate to="/" replace />;

  return <Component />;
};

export default ProtectedRoute;
