import { Link } from "react-router-dom";

export function Header() {
  return (
    <header>
      <nav className="bg-purple-500 p-4 flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <div>Logo</div>
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
            <Link to="/Anmeldung" className="flex items-center gap-2 hover:underline">
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
