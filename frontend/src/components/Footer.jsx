import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white text-teal-600 w-full">
      <nav aria-label="Footer Navigation" className="p-2 flex flex-col sm:flex-row sm:justify-center sm:items-center items-center top-0 left-0 w-full">
        <ul className="flex flex-col sm:flex-row flex-wrap justify-between items-center sm:gap-20 gap-3">
          <p className="text-center sm:text-left w-full sm:w-auto sm:mt-0">&copy; {new Date().getFullYear()}</p>
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
            <Link to="/Contact" className="hover:underline">
              Kontakt
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
