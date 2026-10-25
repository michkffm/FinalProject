import { Navigate, Outlet } from "react-router-dom";
import { MyContext } from "./MyContext";
import { getSessionUserId } from "../session.js";

export function ProtectedRoute() {
  const userId = getSessionUserId(localStorage.getItem("token"));
  if (!userId) return <Navigate to="/login" replace />;
  return <MyContext.Provider value={{ userId }}><Outlet /></MyContext.Provider>;
}
