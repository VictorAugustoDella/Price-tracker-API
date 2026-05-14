import { Navigate } from "react-router-dom";
import { checkSession } from "../services/authService";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    async function verifySession() {
      try {
        const isAuthed = await checkSession();
        setLogged(isAuthed);
      } catch (error) {
        setLogged(false);
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, []);

  if (loading) {
    return null;
  }

  if (logged) {
    return children;
  }

  return <Navigate to={"/login"} replace />;
}

export default ProtectedRoute;
