import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { MyContext } from "./MyContext";


export function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const decodeToken = (token) => {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = atob(payloadBase64);
    const payload = JSON.parse(payloadDecoded);
    return payload.userId;
  };
  const userId = decodeToken(token);
  console.log("Benutzer ID:", userId);
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
    <MyContext.Provider value={{ userId }}>
      {message && <div className="alert">{message}</div>}
      <Outlet />
      </MyContext.Provider>
    </>
  );
}
