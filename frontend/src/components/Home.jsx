import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Home({ setIsLoggedIn }) {
  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    location: "",
  });
  const [isLoggedIn, setIsLoggedInState] = useState(localStorage.getItem("token") !== null);
  const navigate = useNavigate();

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
    navigate("/hauptCategorie");
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
    <main className="flex flex-col items-center justify-center p-4 pt-16 pb-16">
      <section className="hero-section flex flex-col items-center max-w-5xl sm:mt-9 mt-20 p-8 text-center">
        <h1 className="bg-white bg-opacity-50 pl-2 pr-2 rounded text-xl sm:text-3xl font-bold">
          Finde qualifizierte Fachleute für Deine Aufgaben
        </h1>
        <p className="bg-white bg-opacity-50 pl-2 pr-2 rounded text-gray-600 mt-2">
          Verbindung zu qualifizierten Dienstleistern für alle Deine Bedürfnisse
        </p>

        <form className="flex flex-col sm:flex-row gap-4 pt-8 items-center sm:items-start" onSubmit={handleSearchSubmit}>
          <input
            id="search-input"
            className="border border-gray-300 rounded p-2 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            type="text"
            placeholder="Suche nach Dienstleistung"
            disabled={!isLoggedIn}
          />
          <button
            type="submit"
            className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 w-full sm:w-auto"
            disabled={!isLoggedIn}
          >
            Suchen
          </button>
        </form>
      </section>

      <section className="flex justify-center max-w-4xl mx-auto flex flex-col sm:flex-row sm:gap-20 gap-20 mt-6">
        <div className="w-full sm:w-[48%] border border-1 rounded-lg shadow sm:p-6 p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Dienstleistung suchen
          </h2>
          <form className="space-y-4" onSubmit={handleSearchSubmit}>
            <div>
              <label>Wonach suchst Du?</label>
              <input
                id="dienst-input"
                type="text"
                placeholder="Fliesenleger"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!isLoggedIn}
              />
            </div>
            <button
              type="submit"
              className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 w-full sm:w-100%"
              disabled={!isLoggedIn} 
            >
              <Link to={isLoggedIn ? "/hauptCategorie" : "#"}>Suchen</Link>
            </button>
          </form>
        </div>

        <div className="w-full sm:w-[48%] border border-1 rounded-lg shadow sm:p-6 p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Dienstleistung anbieten
          </h2>
          <form className="space-y-4" onSubmit={handleOfferSubmit}>
            <div>
              <label>Was bietest Du an?</label>
              <input
                id="dienst-input"
                type="text"
                placeholder="Fliesenleger"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!isLoggedIn}
              />
            </div>
            <button
              type="submit"
              className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 w-full sm:w-100%"
              disabled={!isLoggedIn}
            >
              <Link to={isLoggedIn ? "/jobs" : "#"}>Anbieten</Link>
            </button>
          </form>
        </div>
      </section>
        {message && <p className="text-red-500 mt-10">{message}</p>}
    </main>
  );
}
