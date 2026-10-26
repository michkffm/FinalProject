import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeSlider } from "./HomeSlider";

export function Home() {
  const [message, setMessage] = useState("");
  const isLoggedIn = localStorage.getItem("token") !== null;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("Bitte logge dich ein, um zu suchen.");
      setTimeout(() => {
        setMessage(""); // Nachricht nach 3 Sekunden ausblenden
        navigate("/login");
      }, 3000);
      return;
    }
    navigate(`/suche?query=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const section = document.querySelector(".handshake-section");
    const timer = setTimeout(() => {
      section?.classList.add("visible");
    }, 100);
    return () => clearTimeout(timer); // Verzögerung von 100ms
  }, []);

  return (
    <main className="position zero-section flex flex-col justify-center items-center sm:pt-28 sm:gap-14 gap-5">
      {/* Nachricht wird nur angezeigt, wenn sie gesetzt wurde und der Benutzer nicht eingeloggt ist */}
      {!isLoggedIn && message && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 text-white border border-green-300 rounded-lg shadow-lg px-6 py-3 text-sm font-medium animate-fade-in bg-red-600">
          {message}
        </div>
      )}
      {/* Handshake Section */}
      <div className="handshake-section absolute inset-0 z-9"></div>

      <section className="home-search-panel relative z-10 flex flex-col justify-center items-center max-w-5xl sm:mt-9 text-center sm:-translate-y-[40px]">
        <h1 className="bg-white bg-opacity-0 pr-2 rounded text-3xl sm:text-4xl text-teal-500 font-bold z-10">
          Finde qualifizierte Fachleute für Deine Aufgaben
        </h1>
        <p className="bg-white bg-opacity-0 pl-2 pr-2 rounded text-gray-600 mt-2 z-10">
          Verbindung zu qualifizierten Dienstleistern für alle Deine Bedürfnisse
        </p>
        <form
          className="flex flex-col sm:flex-row sm:gap-0 gap-2 pt-8 items-center sm:items-start z-10"
          onSubmit={handleSearchSubmit}
        >
          <input
            id="search-input"
            className="bg-white text-gray-900 border border-teal-600 rounded sm:rounded-r-none p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Dienstleistung"
          />
          <button
            type="submit"
            className="bg-teal-700 text-white py-2 px-7 sm:mb-0 mb-10 sm:rounded-r duration-300 hover:bg-teal-500 w-full sm:w-auto"
          >
            Suchen
          </button>
        </form>
      </section>
      <section className="relative z-10 hidden md:block transform -translate-y-[90px]">
        <HomeSlider isLoggedIn={isLoggedIn} />
      </section>
    </main>
  );
}
