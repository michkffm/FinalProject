import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile-1.jpeg";

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
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setMessage("Kein Token gefunden, bitte einloggen.");
      navigate("/profile");
    }
  }, [token, navigate]);

  useEffect(() => {
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
          profilePhoto: data.profilePhoto || "",
          role: data.role || [],
          profession: data.profession || "",
          location: data.location || "",
          description: data.description || "",
        });
      })
      .catch((error) => {
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Abrufen der Profildaten.");
        }
      });
  }, [token]);

  const handleChangeRole = (e) => {
    if (e.target.checked) {
      if (!data.role.includes(e.target.value)) {
        setData((prevData) => ({
          ...prevData,
          role: [...prevData.role, e.target.value],
        }));
      }
    } else {
      setData((prevData) => ({
        ...prevData,
        role: prevData.role.filter((role) => role !== e.target.value),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setData((prevData) => {
      if (type === "file") {
        return { ...prevData, [name]: files[0] };
      }
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

  const handleDeleteProfile = async (profilId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/profiles/${profilId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setProfiles((prevProfiles) =>
        prevProfiles.filter((profil) => profil._id !== profilId)
      );
    } catch (err) {
      setError(err.message || "Fehler beim Löschen des Profils.");
    }
  };

  return (
    <div className="sm:mt-28 mt-32 sm:mb-32 mb-5 bg-gray-50 flex justify-center items-center px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-md rounded-lg p-6 max-w-2xl w-full">
        <div className="w-full sm:w-auto order-0 sm:order-2 m-6 sm:mb-0 flex justify-center">
          <img
            src={profileImage}
            alt="profileimage"
            className="w-100 h-90 sm:ml-6 ml-0 object-cover rounded-[5%] border border-teal-400"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Profil bearbeiten
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
              value={data.profession}
              onChange={handleChange}
            >
              <option value="" disabled>
                Bitte wähle einen Beruf Dienstleistung
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
              <option value="Reparatur und Wartung">Reparatur und Wartung</option>
              <option value="Transport und Logistik">Transport und Logistik</option>
              <option value="Reinigung und Pflege">Reinigung und Pflege</option>
              <option value="Bau- und Renovierungsdienste">
                Bau- und Renovierungsdienste
              </option>
              <option value="Freizeit und Unterhaltung">
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
              name="description"
              value={data.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Gebe hier Deine Beschreibung ein..."
            ></textarea>
          </div>

          {/* Standort */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Standort
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="location"
                value={data.location}
                onChange={handleChange}
                placeholder="Standort eingeben..."
                className="flex-1 p-3 border rounded-md"
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

          {/* Rollen */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Rollen
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Anbieter"
                  onChange={handleChangeRole}
                  className="mr-2"
                />
                Anbieter
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Suchender"
                  onChange={handleChangeRole}
                  className="mr-2"
                />
                Suchender
              </label>
            </div>
          </div>

          {/* Speichern-Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors"
          >
            Speichern
          </button>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-500"
              onClick={() => handleDeleteProfile(data._id)}
            >
              Profil löschen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
