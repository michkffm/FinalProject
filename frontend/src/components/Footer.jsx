import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer>
      <nav>
        <ul>
          <p>@copyright {new Date().getFullYear()}</p>
          <li>
            <Link to="/Impressum">Impressum</Link>
          </li>
          <li>
            <Link to="/Contact">Contakt</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
