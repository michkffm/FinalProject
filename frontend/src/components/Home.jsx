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
        <h1 className="text-3xl sm:text-4xl font-bold z-10">
          Finde qualifizierte Fachleute für Deine Aufgaben
        </h1>
        <p className="mt-4 z-10">
          Verbindung zu qualifizierten Dienstleistern für alle Deine Bedürfnisse
        </p>
        <form
          className="home-search-form flex flex-col sm:flex-row gap-3 mt-7 z-10"
          onSubmit={handleSearchSubmit}
        >
          <input
            id="search-input"
            aria-label="Dienstleistung suchen"
            className="home-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Dienstleistung"
          />
          <button
            type="submit"
            className="home-search-button"
          >
            Suchen <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
      <section className="relative z-10 hidden md:block transform -translate-y-[90px]">
        <HomeSlider isLoggedIn={isLoggedIn} />
      </section>
    </main>
  );
}
