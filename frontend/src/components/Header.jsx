import { API_URL } from "../api.js";
import { Link, NavLink } from "react-router-dom";
import logogross from "../assets/logo-gross-ohne-kontur.png";
import { Inbox } from "./Inbox";
import { useState } from "react";

export function Header({ isLoggedIn, setIsLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (!response.ok && response.status !== 401) throw new Error("Abmeldung fehlgeschlagen");
    } catch {
      setLogoutError("Abmeldung fehlgeschlagen. Bitte erneut versuchen.");
      return;
    }
    setLogoutError("");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="site-header">
      {logoutError && <p role="alert" className="header-error">{logoutError}</p>}
      <nav className="header-bar" aria-label="Hauptnavigation" onKeyDown={e => {
        if (e.key === "Escape") {
          setMenuOpen(false);
          e.currentTarget.querySelector(".header-toggle")?.focus();
        }
      }}>
        <Link to="/" className="header-brand" onClick={() => setMenuOpen(false)}>
          <img src={logogross} alt="EasyHelfer – Startseite" />
        </Link>
        <button type="button" className="header-toggle" onClick={toggleMenu}
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={menuOpen} aria-controls="main-navigation">
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
        <ul id="main-navigation" className={`header-links ${menuOpen ? "is-open" : ""}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}><i aria-hidden="true" className="fa-solid fa-house" />Start</NavLink></li>
          {isLoggedIn ? <>
            <li><NavLink to="/hauptCategorie" onClick={() => setMenuOpen(false)}><i aria-hidden="true" className="fa-solid fa-layer-group" />Kategorien</NavLink></li>
            <li><NavLink to="/profile" onClick={() => setMenuOpen(false)}><i aria-hidden="true" className="fa-solid fa-user" />Profil</NavLink></li>
            <li className="header-inbox"><Inbox setMenuOpen={setMenuOpen} /></li>
          </> : <>
            <li><NavLink to="/register" onClick={() => setMenuOpen(false)}><i aria-hidden="true" className="fa-solid fa-user-plus" />Registrieren</NavLink></li>
            <li><NavLink to="/login" onClick={() => setMenuOpen(false)}><i aria-hidden="true" className="fa-solid fa-right-to-bracket" />Login</NavLink></li>
          </>}
          <li><NavLink to="/Hilfe" onClick={() => setMenuOpen(false)}><i aria-hidden="true" className="fa-solid fa-circle-info" />Hilfe</NavLink></li>
          {isLoggedIn && <li className="header-logout"><button type="button" onClick={() => {
            handleLogout();
            setMenuOpen(false);
          }}><i aria-hidden="true" className="fa-solid fa-right-from-bracket" />Abmelden <span className="logout-scope">(alle Geräte)</span></button></li>}
        </ul>
      </nav>
    </header>
  );
}
