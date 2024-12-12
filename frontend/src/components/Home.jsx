import "../App.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Home() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=b6ac76c3a4584145b820399ee203ee28`
            );
            const locationData = await response.json();
            const city =
              locationData.results[0]?.components?.city ||
              locationData.results[0]?.components?.town ||
              locationData.results[0]?.components?.village ||
              "Unbekannt";
            setData((prevState) => ({
              ...prevState,
              location: city,
            }));
          } catch (error) {
            console.error("Fehler beim Abrufen der Location-Daten:", error);
            setMessage("Fehler beim Abrufen des Standorts.");
          }
        },
        (error) => {
          console.error("Geolocation-Fehler:", error);
          setMessage("Fehler beim Abrufen des Standorts: " + error.message);
        }
      );
    } else {
      setMessage("Geolocation ist in diesem Browser nicht unterstützt.");
    }
  };

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
          Suchen nach Dienstleistung
          </h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Standort:
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={data.location}
                onChange={handleChange}
                placeholder="Standort eingeben oder abrufen"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleLocation}
                className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500"
              >
                Standort abrufen
              </button>
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
              <Link
                to="/profile"
                className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 w-full sm:w-auto ml-24"
              >
                Profile erstellen
              </Link>
            </button>
          </form>
        </div>

        <div className="w-full sm:w-[48%] border-2 rounded-lg p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Dienstleistung anbieten
          </h2>
          <form className="space-y-4">
          <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Standort:
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={data.location}
                onChange={handleChange}
                placeholder="Standort eingeben oder abrufen"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleLocation}
                className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500"
              >
                Standort abrufen
              </button>
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
            <button>
              <Link
                to="/profile"
                className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 w-full sm:w-auto ml-24"
              >
                Profile erstellen
              </Link>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
