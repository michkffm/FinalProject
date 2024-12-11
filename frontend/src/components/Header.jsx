import { Link } from "react-router-dom";
import logogross from "../assets/logo-gross-kontur.png";

export function Header() {
  return (
    <header>
      <nav className="bg-blue-500 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center items-center fixed top-0 left-0 w-full">
        <div className="text-white text-xl font-bold mb-4 sm:mb-0">
          <img src={logogross} alt="logo" className="w-36 sm:w-25" />
        </div>
        <ul className="flex flex-row sm:flex-row gap-4 sm:gap-8 text-white text-lg">
          <li>
            <Link to="/" className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
              <i className="fa-solid fa-house"></i>
              Home
            </Link>
          </li>
          <li>
            <Link to="/register" className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
              <i className="fa-solid fa-user"></i>
              Registrieren
            </Link>
          </li>
          <li>
            <Link to="/login" className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
              <i className="fa-solid fa-right-to-bracket"></i>
              Login
            </Link>
          </li>
          <li>
            <Link to="/Hilfe" className="flex flex-col sm:flex-row items-center gap-1 hover:underline">
              <i className="fa-solid fa-question"></i>
              Hilfe
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}