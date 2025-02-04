import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./MyContext.jsx";
import { useContext } from "react";

export function Job({ setIsLoggedIn }) {
  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    contact: "",
    username: "",
  });

  const [profileData, setProfileData] = useState({
    profilePhoto: "",
    role: [],
    profession: "",
    location: "",
    description: "",
  });

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { userId } = useContext(MyContext); 
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    // Benutzernamen aus dem localStorage abrufen
    const username = localStorage.getItem("username");
    if (username) {
      setData((prevData) => ({
        ...prevData,
        username: username, // Setze den Benutzernamen in den State
      }));
    } // Abrufen der Kategorie aus localStorage
    const category = localStorage.getItem("selectedCategory");
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setMessage("Kein Token gefunden, bitte einloggen.");
      setTimeout(() => navigate("/hauptCategorie"), 2000);
    } else {
      fetchProfileData();
    }
  }, [token, navigate]);

  const fetchProfileData = () => {
    fetch("http://localhost:3000/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((data) => {
        setProfileData({
          profilePhoto: data.profilePhoto || "",
          role: data.role || [],
          profession: data.profession || "",
          location: data.location || "",
          description: data.description || "",
        });
        setData((prevData) => ({
          ...prevData,
          category: data.profession || "",
          location: data.location || "",
          description: data.description || "",
        }));
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Profildaten:", error);
        setMessage("Fehler beim Abrufen der Profildaten.");
      });
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Sie sind nicht eingeloggt.");
      return;
    }

    fetch("http://localhost:3000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(errorText || "Ein Fehler ist aufgetreten.");
          });
        }
        return response.json();
      })
      .then((responseData) => {
        setMessage("Dienstleistung erfolgreich erstellt!");
        console.log("Erstellte Jobdaten:", responseData);

        // Reset Form
        setData({
          title: "",
          description: "",
          price: "",
          category: "",
          location: "",
          contact: "",
          username: "",
        });

        // Navigation nach einer Verzögerung
        setTimeout(() => navigate("/hauptCategorie"), 2000);
      })
      .catch((error) => {
        setMessage("Fehler beim Erstellen des Jobs: " + error.message);
        console.error("Fehler beim Absenden des Formulars:", error);
      });
  };

  return (
    <div className="zero-section min-h-screen px-4 py-8 flex justify-center items-center">
      <div className="flex flex-col sm:flex-row justify-between sm:mt-14 mt-12 items-center border-2 border-teal-300 bg-white bg-opacity-40 shadow-lg rounded-lg p-6 max-w-4xl w-full">
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Dienstleistung erstellen
          </h2>

          {message && (
            <div
              className={`mt-4 p-3 text-white ${
                message.includes("Fehler") ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {message}
            </div>
          )}

          {/* Titel */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Titel:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={handleChange}
              placeholder="Tätigkeit eingeben..."
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Beschreibung */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
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
              <option value="Betreuung und Gesundheit">
                Betreuung und Gesundheit
              </option>
              <option value="Finanzen und Versicherungen">
                Finanzen und Versicherungen
              </option>
              <option value="Technologie und IT">Technologie und IT</option>
              <option value="Reparatur und Wartung">
                Reparatur und Wartung
              </option>
              <option value="Transport und Logistik">
                Transport und Logistik
              </option>
              <option value="Reinigung und Pflege">Reinigung und Pflege</option>
              <option value="Bau- und Renovierungsdienste">
                Bau- und Renovierungsdienste
              </option>
              <option value="Freizeit und Unterhaltung">
                Freizeit und Unterhaltung
              </option>
              <option value="Essen und Trinken">
              Essen und Trinken
              </option>
              <option value="Sport und Lifestyle">
              Sport und Lifestyle
              </option>
            </select>
          </div>

          {/* Standort */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
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
                className="bg-teal-500 text-white px-4 py-2 rounded duration-300 hover:bg-teal-600 transition-colors"
              >
                Abrufen
              </button>
            </div>
          </div>

          {/* Kontakt */}
          <div className="space-y-2">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
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
            className="w-full bg-teal-500 text-white py-2 rounded duration-300 hover:bg-teal-600 transition-colors"
          >
            Speichern
          </button>
        </form>
      </div>
    </div>
  );
}
