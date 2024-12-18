import { Link } from "react-router-dom";
import logogross from "../assets/logo-gross-ohne-kontur.png";

export function Header({ isLoggedIn, setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // Token beim Ausloggen entfernen
  };

  return (
    <header>
      <nav className="bg-teal-600 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center items-center fixed top-0 left-0 w-full">
        <div className="text-white text-xl font-bold mb-4 sm:mb-0">
          <Link to="/">
            <img src={logogross} alt="logo" className="w-36 sm:w-25" />
          </Link>
        </div>
        <ul className="flex flex-row sm:flex-row gap-4 sm:gap-8 text-white text-lg">
          <li>
            <Link
              to="/"
              className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
              <i className="fa-solid fa-house"></i>
              Home
            </Link>
          </li>
          {!isLoggedIn && (
            <>
              <li>
                <Link
                  to="/register"
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
                  <i className="fa-solid fa-user"></i>
                  Registrieren
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
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
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
                  <i className="fa-solid fa-user"></i>
                  Profil
                </Link>
              </li>
              <li>
                <Link
                  to="/hauptCategorie"
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
                  <i className="fa-solid fa-list"></i>
                  Kategorie
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Ausloggen
                </button>
              </li>
            </>
          )}
          <li>
            <Link
              to="/Hilfe"
              className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
              <i className="fa-solid fa-question"></i>
              Hilfe
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}