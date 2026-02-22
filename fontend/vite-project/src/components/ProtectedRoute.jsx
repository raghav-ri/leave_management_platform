import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;

  // If specific roles are required, check them
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to the user's own dashboard instead of login
    if (role === "admin") return <Navigate to="/admin" />;
    if (role === "manager") return <Navigate to="/manager" />;
    return <Navigate to="/employee" />;
  }

  return children;
}
