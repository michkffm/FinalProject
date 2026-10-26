import { Link } from "react-router-dom";

export function PaymentMethods() {
  return (
    <main className="zero-section min-h-screen px-4 pt-40 flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">Onlinezahlungen sind derzeit nicht verfügbar</h1>
      <p>Bitte kontaktiere den Anbieter über die Nachrichtenfunktion, um die Dienstleistung abzustimmen.</p>
      <p>Auf dieser Seite wird keine Buchung oder Zahlung ausgelöst.</p>
      <Link to="/hauptCategorie" className="bg-teal-500 text-white px-4 py-2 rounded">Zu den Angeboten</Link>
    </main>
  );
}
