import { Navigate, Outlet } from "react-router-dom";
import permissions from "../config/permissions";

function ProtectedRoute({ permission, role = "Finance Manager" }) {
  const allowed = permissions[role] || [];

  if (!allowed.includes(permission)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;