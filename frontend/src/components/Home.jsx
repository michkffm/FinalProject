import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HomeSlider } from "./HomeSlider";
import { Footer } from "./Footer";

export function Home() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    location: "",
  });
  const [isLoggedIn] = useState(localStorage.getItem("token") !== null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  useEffect(() => {
    const section = document.querySelector(".handshake-section");
    setTimeout(() => {
      section.classList.add("visible");
    }, 100); // Verzögerung von 100ms
  }, []);
  useEffect(() => {
    if (!isLoggedIn) {
      setMessage("Bitte logge dich ein, um fortzufahren.");
    }
  }, [isLoggedIn]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("Bitte logge dich ein, um zu suchen.");
      return;
    }
    navigate(`/suche?query=${query}`);
  };
  const handleOfferSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("Bitte logge dich ein, um etwas anzubieten.");
      return;
    }
    navigate("/jobs");
  };
  return (
    <main className="position zero-section flex flex-col justify-center items-center sm:pt-28 sm:gap-14 gap-5 transform -translate-y-[40px]">
      {message && (
          <p className=" sm:mt-6 text-red-600 p-1 rounded text-2xl z-20">
            {message}
          </p>
        )}
      <div className="handshake-section absolute inset-0 z-9">
      </div>
      <section className="flex flex-col justify-center items-center max-w-5xl sm:mt-9 text-center transform -translate-y-[40px]">
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
            className="sm:rounded-l p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Dienstleistung"
            disabled={!isLoggedIn}
          />
          <button
            type="submit"
            className="bg-teal-400 text-white py-2 px-7 sm:mb-0 mb-10 sm:rounded-r duration-300 hover:bg-teal-500 w-full sm:w-auto"
            disabled={!isLoggedIn}
          >
            Suchen
          </button>
        </form>
      </section>
      <section className="z-10 sm:mb-5 px-4 sm:px-6 lg:px-8 transform -translate-y-[60px]">
        <div className="bg-white bg-opacity-40 border-2 border-teal-300 rounded-md shadow p-4 duration-300 hover:bg-opacity-50">
          <h2 className="font-semibold mb-2">Dienstleistung anbieten</h2>
          <form className="space-y-4" onSubmit={handleOfferSubmit}>
            <div>
              <label>Was bietest Du an?</label>
            </div>
            <button
              type="submit"
              className="bg-teal-400 text-white py-2 px-4 rounded duration-300 hover:bg-teal-500 w-full sm:w-100%"
              disabled={!isLoggedIn}
            >
              <Link to={isLoggedIn ? "/jobs" : "#"}>Anbieten</Link>
            </button>
          </form>
        </div>
      </section>
      <section className="hidden md:block transform -translate-y-[60px]">
        <HomeSlider />
      </section>
    </main>
  );
}









