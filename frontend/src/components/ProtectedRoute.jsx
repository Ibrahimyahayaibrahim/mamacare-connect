import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Frontend gate for UX only (skip the flash of a page that will redirect).
// The real security boundary is server-side: every API route the
// dashboard calls must run through the backend's `protect` /
// `allowRoles` middleware regardless of what this component does.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
