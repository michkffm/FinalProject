import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("Bitte logge dich ein, um fortzufahren.");
      const timer = setTimeout(() => setMessage("Bitte logge dich ein, um fortzufahren"), 3000);

      return () => clearTimeout(timer); // Cleanup, falls die Komponente unmountet
    }
  }, [token]); // `useEffect` wird nur ausgelöst, wenn sich `token` ändert

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {message && <div className="alert">{message}</div>}
      <Outlet />
    </>
  );
}
