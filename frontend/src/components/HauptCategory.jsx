import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import beratung from "../assets/beratung.jpeg";
import bildung from "../assets/bildung.jpeg";
import gesundheit from "../assets/gesundheit.jpeg";
import finance from "../assets/finance.jpeg";
import technologie from "../assets/technologie.jpeg";
import reparatur from "../assets/reparatur.jpeg";
import transport from "../assets/transport.jpeg";
import reinigung from "../assets/reinigung.jpeg";
import bau from "../assets/bau.jpeg";
import freizeit from "../assets/freizeit.jpeg";
import essen from "../assets/essen und trinken.jpeg";
import sport from "../assets/sport.jpeg";

const categories = [
  { name: "Beratung", image: beratung, path: "/categorie/Beratung" },
  { name: "Bildung und Schulung", image: bildung, path: "/categorie/Bildung und Schulung" },
  { name: "Betreuung und Gesundheit", image: gesundheit, path: "/categorie/Betreuung und Gesundheit" },
  { name: "Finanzen und Versicherungen", image: finance, path: "/categorie/Finanzen und Versicherungen" },
  { name: "Technologie und IT", image: technologie, path: "/categorie/Technologie und IT" },
  { name: "Reparatur und Wartung", image: reparatur, path: "/categorie/Reparatur und Wartung" },
  { name: "Transport und Logistik", image: transport, path: "/categorie/Transport und Logistik" },
  { name: "Reinigung und Pflege", image: reinigung, path: "/categorie/Reinigung und Pflege" },
  { name: "Bau- und Renovierungsdienste", image: bau, path: "/categorie/Bau- und Renovierungsdienste" },
  { name: "Freizeit und Unterhaltung", image: freizeit, path: "/categorie/Freizeit und Unterhaltung" },
  { name: "Essen und Trinken", image: essen, path: "/categorie/Essen und Trinken" },
  { name: "Sport und Lifestyle", image: sport, path: "/categorie/Sport und Lifestyle" },
];

export function HauptCategory() {
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
    navigate(`/suche?query=${query}`);
  };

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("Bitte logge dich ein, um etwas anzubieten.");
      setTimeout(() => {
        setMessage(""); // Nachricht nach 3 Sekunden ausblenden
        navigate("/login");
      }, 3000);
      return;
    }
    navigate("/jobs");
  };

  return (
    <div className="zero-section min-h-screen sm:mt-0 mt-10 bg-gray-50 px-4 py-8">
      <div className="flex justify-center">
        <Link to="/jobs">
          <button className="bg-teal-600 text-white bg-opacity-40 p-4 sm:mt-14 mt-0 mb-8 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105">
            Dienstleistung hinzufügen
          </button>
        </Link>
      </div>
      <section className="flex flex-col justify-center items-center sm:mt-9 text-center transform -translate-y-[40px]">
        <form
          className="flex flex-col sm:flex-row sm:gap-0 gap-2 pt-8 items-center sm:items-start z-10"
          onSubmit={handleSearchSubmit}
        >
          <input
            id="search-input"
            className="sm:rounded-l p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Dienstleistung"
          />
          <button
            type="submit"
            className="bg-teal-400 text-white py-2 px-7 sm:mb-0 mb-10 sm:rounded-r duration-300 hover:bg-teal-500 w-full sm:w-auto"
          >
            Suchen
          </button>
        </form>
      </section>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl m-4 font-bold text-center text-teal-800">
          Bitte wähle eine Kategorie
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
            >
              <span className="text-lg font-semibold">{category.name}</span>
              <img
                src={category.image}
                alt={category.name}
                className="rounded-lg h-44 w-72 object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}