import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Job({ setIsLoggedIn }) {
  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    contact: "",
  });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("Kein Token gefunden, bitte einloggen.");
      setTimeout(() => navigate("/profile"), 2000);
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
            console.error("Fehler beim Abrufen der Standortdaten:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Sie sind nicht eingeloggt.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Ein Fehler ist aufgetreten.");
      }

      const responseData = await response.json();
      setMessage("Job erfolgreich erstellt!");
      console.log("Erstellte Jobdaten:", responseData);

      // Reset Form
      setData({
        title: "",
        description: "",
        price: "",
        category: "",
        location: "",
        contact: "",
      });

      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      setMessage("Fehler beim Erstellen des Jobs: " + error.message);
      console.error("Fehler beim Absenden des Formulars:", error);
    }
  };

  return (
    <div className="sm:mt-0 mt-32 min-h-screen bg-gray-50 flex justify-center items-center px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center">Dienstleistung erstellen</h2>

          {message && <p className="text-center text-red-500">{message}</p>}

          {/* Titel */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titel:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={handleChange}
              placeholder="Jobtitel eingeben..."
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Beschreibung */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Beschreibung:
            </label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              rows="3"
              placeholder="Beschreibe den Job..."
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Preis */}
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Preis:
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={data.price}
              onChange={handleChange}
              placeholder="Preis eingeben..."
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Kategorie */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Kategorie:
            </label>
            <select
              id="category"
              name="category"
              value={data.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Bitte wähle eine Kategorie
              </option>
              <option value="Beratung">Beratung</option>
              <option value="Bildung und Schulung">Bildung und Schulung</option>
              <option value="Betreuung und Gesundheit">Betreuung und Gesundheit</option>
              <option value="Finanzen und Versicherungen">Finanzen und Versicherungen</option>
              <option value="Technologie und IT">Technologie und IT</option>
              <option value="Reparatur und Wartung">Reparatur und Wartung</option>
              <option value="Transport und Logistik">Transport und Logistik</option>
              <option value="Reinigung und Pflege">Reinigung und Pflege</option>
              <option value="Bau- und Renovierungsdienste">Bau- und Renovierungsdienste</option>
              <option value="Freizeit und Unterhaltung">Freizeit und Unterhaltung</option>
            </select>
          </div>

          {/* Standort */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Standort:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="location"
                id="location"
                value={data.location}
                onChange={handleChange}
                placeholder="Standort eingeben..."
                className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={handleLocation}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
              >
                Abrufen
              </button>
            </div>
          </div>

          {/* Kontakt */}
          <div className="space-y-2">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Kontakt:
            </label>
            <input
              type="text"
              name="contact"
              id="contact"
              value={data.contact}
              onChange={handleChange}
              placeholder="Kontaktdaten eingeben..."
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Speichern-Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors"
          >
            Speichern
          </button>
        </form>
      </div>
    </div>
  );
}
