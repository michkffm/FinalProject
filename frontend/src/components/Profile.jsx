import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import profileImage from "../assets/profile.jpeg";

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setMessage("Kein Token gefunden, bitte einloggen.");
      navigate("/profile");
    }
  }, [token, navigate]);

  useEffect(() => {
    //wird am Amfang nur einmal ausgeführt
    //fetch Anfrage an users/profile(Get)
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
        setData({
          profilePhoto: data.profilePhoto ? data.profilePhoto : "",
          role: data.role ? data.role : [],
          profession: data.profession ? data.profession : "",
          location: data.location ? data.location : "",
          description: data.description ? data.description : "",
        });
      })
      .catch((error) => {
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Erstellen des Profils.");
        }
      });
  }, []);

  const handleChangeRole = (e) => {
    if (e.target.checked) {
      if (!data.role.includes(e.target.value)) {
        setData((prevData) => {
          return {
            ...prevData, // Kopie des gesamten vorherigen Objekts
            role: [...prevData.role, e.target.value], // Neue Kopie von `role` mit dem hinzugefügten Wert
          };
        });
      }
    } else {
      setData((prevData) => {
        return {
          ...prevData, // Kopie des gesamten vorherigen Objekts
          role: prevData.role.filter((role) => role === e.target.value),
        };
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setData((prevData) => {
      if (type === "file") {
        return { ...prevData, [name]: files[0] }; // Speichert die erste Datei
      }

      // Bei anderen Eingabetypen wird der Wert des Feldes übernommen
      return { ...prevData, [name]: value };
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.append("profilePhoto", data.profilePhoto);
    // formData.append("role", JSON.stringify(data.role));
    // formData.append("profession", data.profession);
    // formData.append("location", data.location);
    // formData.append("description", data.description);

    // console.log([...formData]);

    fetch("http://localhost:3000/users/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
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
        console.log("Gesendete Daten:", data);

        setMessage("Profil erfolgreich gespeichert!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Speichern des Profils.");
        }
      });
  };

  return (
    <div className="flex items-center justify-center sm:mt-44 mt-44 mb-4">
      <div className="border-2 border-gray-300 rounded-lg shadow-lg p-8 bg-white w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile photo */}
          {/* <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Profile erstellen
            </h2>
            <label
              htmlFor="profilePhoto"
              className="block text-sm font-medium text-gray-700 text-center "
            ></label>
            <div className="relative w-20 h-20 left-48">
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer "
              />
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-white shadow-md">
                <span className="text-sm">📷</span>
              </div>
            </div>
          </div> */}

          {/* Other fields */}
          <div className="space-y-2">
            <label
              htmlFor="profession"
              className="block text-sm font-medium text-gray-700"
            >
              Kategorie:
            </label>
            <select
              name="profession"
              id="profession"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.profession} // Bindung an den State
              onChange={handleChange} // Handle Change, um den State zu aktualisieren
            >
              <option value="" disabled>
                Bitte wähle einen Beruf Dienstleistung
              </option>
              <option value="Beratung">Beratung</option>
              <option value="Bildung und Schulung">Bildung und Schulung</option>
              <option
                value="Betreuung und Gesundheit
"
              >
                Betreuung und Gesundheit
              </option>
              <option
                value="Finanzen und Versicherungen
"
              >
                Finanzen und Versicherungen
              </option>
              <option
                value="Technologie und IT
"
              >
                Technologie und IT
              </option>
              <option
                value="Reparatur und Wartung
"
              >
                Reparatur und Wartung
              </option>
              <option
                value="Transport und Logistik
"
              >
                Transport und Logistik
              </option>
              <option
                value="Reinigung und Pflege
"
              >
                Reinigung und Pflege
              </option>
              <option
                value="Bau- und Renovierungsdienste
"
              >
                Bau- und Renovierungsdienste
              </option>
              <option
                value="Freizeit und Unterhaltung
"
              >
                Freizeit und Unterhaltung
              </option>
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
              className="w-full p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Gebe hier Deine Beschreibung ein..."
            ></textarea>
          </div>

          {/* Location */}
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

          {/* Roles */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            ></label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="role"
                  value="Anbieter"
                  onChange={handleChangeRole}
                  className="h-5 w-5 text-blue-600"
                />
                <span> Anbieter </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="role"
                  value="Suchender"
                  onChange={handleChangeRole}
                  className="h-5 w-5 text-blue-600"
                />
                <span> Suchender </span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-teal-400 text-white py-2 px-4 rounded hover:bg-teal-500 ml-44"
          >
            Speichern
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
      <img
        src={profileImage}
        alt="profileimage"
        className="h-2/6 w-2/6 object-cover border rounded-2"
      />
    </div>
  );
}
