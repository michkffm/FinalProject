import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header>
      <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Registrieren">Registrieren</Link></li>
            <li><Link to="/Anmeldung">Anmeldung</Link></li>
            <li><Link to="/Hilfe">Hilfe</Link></li>
        </ul>
      </nav>
    </header>
  )
}