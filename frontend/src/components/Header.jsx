import { Link } from "react-router-dom";
import logogross from "../assets/logo-gross-ohne-kontur.png";
import { Inbox } from "./Inbox";
import { useState } from "react";

export function Header({ isLoggedIn, setIsLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header>
      <nav className="p-2 flex sm:bg-opacity-50 z-20 bg-opacity-100 sm:gap-14 gap-1 bg-white shadow-lg flex-col sm:flex-row sm:justify-center sm:items-center items-center fixed top-0 left-0 w-full">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <div className="text-xl font-bold">
            <Link to="/">
              <img src={logogross} alt="logo" className="w-36 sm:w-25" />
            </Link>
          </div>
          <button
            className="sm:hidden text-teal-600 text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>

        <ul
          className={`${
            menuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row items-center gap-4 sm:gap-10 text-teal-600 text-lg w-full sm:w-auto`}
        >
          <li>
            <Link
              to="/"
              className="flex flex-col sm:flex-row items-center gap-1 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              <i className="fa-solid fa-house"></i>
              Start
            </Link>
          </li>
          {!isLoggedIn && (
            <>
              <li>
                <Link
                  to="/register"
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fa-solid fa-user"></i>
                  Registrieren
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Login
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link
                  to="/profile"
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fa-solid fa-user"></i>
                  Profil
                </Link>
              </li>
              <li>
                <Link
                  to="/hauptCategorie"
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fa-solid fa-layer-group"></i>
                  Kategorien
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </button>
              </li>
              <li>
                <Inbox />
              </li>
            </>
          )}
          <li>
            <Link
              to="/Hilfe"
              className="flex flex-col sm:flex-row items-center gap-1 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              <i className="fa-solid fa-circle-info"></i>
              Hilfe
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
