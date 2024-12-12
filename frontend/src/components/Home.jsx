import "../App.css";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="bilal flex flex-col items-center justify-center p-4 pt-16 pb-16">
      <section className="hero-section flex flex-col items-center max-w-5xl sm:mt-9 mt-20 p-8 text-center">
        <h1 className="text-xl sm:text-2xl font-bold">
          Finden Sie qualifizierte Fachleute für Ihre Aufgaben
        </h1>
        <p className="text-gray-600 mt-2">
          Verbindung zu qualifizierten Dienstleistern für alle Ihre Bedürfnisse
        </p>
        <form className="flex flex-col sm:flex-row gap-4 pt-8 items-center sm:items-start">
          <input
            id="search-input"
            className="border border-gray-300 rounded p-2 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            type="text"
            placeholder="suche nach Dienstleistung"
          />
          <button
            type="submit"
            className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 w-full sm:w-auto"
          >
            Suchen
          </button>
        </form>
      </section>
      <section className="flex justify-center max-w-4xl mx-auto flex flex-col sm:flex-row gap-40 mt-6">
        <div className="w-full sm:w-[48%] border-2 rounded-lg p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Finden nach Dienstleister
          </h2>
          <form className="space-y-4">
            <div>
              <label>Stadt</label>
              <input
                id="stadt-input"
                type="text"
                placeholder="Frankfurt"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label>Entfernung (in km)</label>
              <input
                id="kilometer-slider"
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                Aktuelle Auswahl: <span id="kilometer-value">50</span> km
              </div>
            </div>
            <div>
              <label>Was brauchst du?</label>
              <input
                id="dienst-input"
                type="text"
                placeholder="Fliesenleger"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button>
            <Link to="/profile" className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 w-full sm:w-auto">
              Profile erstellen
            </Link>
          </button>
          </form>
        </div>

        <div className="w-full sm:w-[48%] border-2 rounded-lg p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Bieten nach Dienstleistung
          </h2>
          <form className="space-y-4">
            <div>
              <label>Stadt</label>
              <input
                id="stadt-input"
                type="text"
                placeholder="Frankfurt"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label>Entfernung (in km)</label>
              <input
                id="kilometer-slider"
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                Aktuelle Auswahl: <span id="kilometer-value">50</span> km
              </div>
            </div>
            <div>
              <label>Was bietest du an?</label>
              <input
                id="dienst-input"
                type="text"
                placeholder="Fliesenleger"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 w-full sm:w-auto"
            >
              Bieten
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}