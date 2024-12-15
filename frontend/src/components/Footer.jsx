import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-blue-700 text-white p-4 mt-20 fixed bottom-0 left-0 w-full">
      
      <nav aria-label="Footer Navigation">
        <ul className="flex flex-wrap justify-between items-center gap-4">
        <p className="text-center mt-4">©copyright {new Date().getFullYear()}</p>
          <li>
            <Link to="/impressum" className="hover:underline">
              Impressum
            </Link>
          </li>
          <li>
            <Link to="/Agb" className="hover:underline">
              AGB
            </Link>
          </li>
          <li>
            <Link to="/Datenschutz" className="hover:underline">
              Datenschutz
            </Link>
          </li>
          <li>
            <Link to="/Cookie" className="hover:underline">
              Cookie-Einstellungen
            </Link>
          </li>
          <li>
            <Link to="/Contact" className="hover:underline">
              Kontakt
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
