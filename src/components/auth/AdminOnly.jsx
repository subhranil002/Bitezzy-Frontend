import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminOnly() {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const location = useLocation();

  const isAdmin = role === "ADMIN";

  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      toast.error("You don't have access to this page!");
    }
  }, [isLoggedIn, isAdmin]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    const from = location.state?.from;
    const redirectTo =
      (typeof from === "string" ? from : from?.pathname) || "/";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default AdminOnly;
