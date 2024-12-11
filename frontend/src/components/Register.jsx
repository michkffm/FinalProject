import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [data, setData] = useState({
    profilePhoto: "",
    username: "",
    password: "",
    email: "",
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
      [name]: type === "checkbox"
        ? checked
        : type === "file"
        ? files[0]
        : value,
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

    fetch("http://localhost:3000/register", {
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
        setMessage("Registrierung erfolgreich!");
        console.log("Erfolgreich:", result);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        setMessage("Fehler bei der Registrierung: " + error.message);
        console.error("Fehler:", error);
      });
  };

  const roles = ["Anbieter", "Suchender"];

  return (
    <div className="flex items-center justify-center sm:mt-44 mt-44 mb-4">
      <div className="border-2 border-gray-300 rounded-lg shadow-lg p-8 bg-white w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profilbild */}
          <div className="space-y-2">
            <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
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
          {/* Rollen */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rolle:</label>
            {roles.map((role) => (
              <label key={role} className="block">
                <input
                  type="checkbox"
                  name="role"
                  value={role}
                  checked={data.role.includes(role)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData((prevState) => ({
                        ...prevState,
                        role: [...prevState.role, role],
                      }));
                    } else {
                      setData((prevState) => ({
                        ...prevState,
                        role: prevState.role.filter((r) => r !== role),
                      }));
                    }
                  }}
                  className="mr-2 leading-tight"
                />
                {role}
              </label>
            ))}
          </div>
          {/* Standort */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-Mail:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Passwort:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Beschreibe dich selbst..."
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {/* Registrierung */}
          <button
            type="submit"
            className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 ml-44"
          >
            Registrieren
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
