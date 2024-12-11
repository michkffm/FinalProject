import { Link } from "react-router-dom";
// import logokontur from "../assets/Logo-mit-kontur.png";
// import logoohnekontur from "../assets/logo-gross-ohne-kontur.png";
import logogross from "../assets/logo-gross-kontur.png";

export function Header() {
  return (
    <header>
      <nav className="bg-blue-700 p-4 flex justify-between items-center fixed top-0 left-0 w-full">
        <div className="text-white text-xl font-bold">
          <img src={logogross} alt="logo" className="w-72"/>
        </div>
        <ul className="flex gap-8 text-white text-lg">
          <li>
            <Link to="/Home" className="flex items-center gap-2 hover:underline">
              <i className="fa-solid fa-house"></i>
              Home
            </Link>
          </li>
          <li>
            <Link to="/register" className="flex items-center gap-2 hover:underline">
              <i className="fa-solid fa-user"></i>
              Registrieren
            </Link>
          </li>
          <li>
            <Link to="/login" className="flex items-center gap-2 hover:underline">
              <i className="fa-solid fa-right-to-bracket"></i>
              Anmeldung
            </Link>
          </li>
          <li>
            <Link to="/Hilfe" className="flex items-center gap-2 hover:underline">
              <i className="fa-solid fa-question"></i>
              Hilfe
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
