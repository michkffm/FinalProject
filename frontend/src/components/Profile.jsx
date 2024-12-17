import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [data, setData] = useState({
    profilePhoto: "",
    role: [],
    profession: "",
    location: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Änderungen im Formular speichern
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setData({
      ...data,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
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


  // Registrierung absenden
  const handleSubmit = (e) => {
    e.preventDefault();

    // FormData verwenden, falls ein Bild hochgeladen wird
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    });

  fetch("http://localhost:3000/profile", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      }
      return res.json();
    })
    .then((result) => {
      setMessage("profile erfolgreich!");
      console.log("Erfolgreich:", result);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    })
    .catch((error) => {
      setMessage("Fehler beim Profile erstellen: " + error.message);
      console.error("Fehler:", error);
    });
}

return (
  <div className="flex items-center justify-center sm:mt-44 mt-44 mb-4">
    <div className="border-2 border-gray-300 rounded-lg shadow-lg p-8 bg-white w-full max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profilbild */}
        <div className="space-y-2">
          <label
            htmlFor="profilePhoto"
            className="block text-sm font-medium text-gray-700"
          >
            Profilbild hochladen:
          </label>
          <input
            type="file"
            id="profilePhoto"
            name="profilePhoto"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profession"
            className="block text-sm font-medium text-gray-700"
          >
            Diensleistung:
          </label>
          <select
            name="profession"
            id="profession"
            value={data.profession}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled selected>
              Bitte wählen Sie einen Beruf
            </option>
            <option value="Storm">Storm</option>
            <option value="Babysitting">Babysitting</option>
            <option value="IT">IT</option>
            <option value="Heizung">Heizung</option>
            <option value="Nachhilfe">Nachhilfe</option>
          </select>
        </div>
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
            required
            rows="3"
            className="w-full  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Geben Sie hier Ihre Beschreibung ein..."
          ></textarea>
        </div>
        {/* Standort */}
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
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
          >
            Standort abrufen
          </button>
        </div>

        {/* Rollen */}
        <div className="space-y-2">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Rolle:
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="role"
                value="Anbieter"
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Anbieter</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="role"
                value="Suchender"
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Suchender</span>
            </label>
          </div>
        </div>
        {/* Registrierung */}
        <button
          type="submit"
          className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 ml-44"
        >
          Profile erstellen
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 p-3 text-white ${
            message.includes("Fehler") ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  </div>
);
}
