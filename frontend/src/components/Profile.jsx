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
  const [error, setError] = useState(null);
  const decodeToken = (token) => {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = atob(payloadBase64);
    const payload = JSON.parse(payloadDecoded);
    return payload.userId;
  };
  const userId = decodeToken(token);
  console.log("Benutzer ID:", userId);
  useEffect(() => {
    if (!token) {
      setMessage("Bitte log dich ein.");
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
        localStorage.setItem("selectedCategory", data.profession);
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
  const handleDeleteProfile = () => {
    fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
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
      .then(() => {
        setMessage("Profil erfolgreich gelöscht.");
        setTimeout(() => {
          navigate("/register");
        }, 2000);
      })
      .catch((error) => {
        setMessage("Fehler beim Löschen des Profils: " + error.message);
        console.error("Fehler beim Löschen des Profils:", error);
      });
  };

  return (
    <div className="zero-section flex flex-col justify-center items-center sm:pt-28 sm:gap-14 gap-5">
      <div className="flex flex-col bg-white bg-opacity-40 sm:flex-row justify-between items-center border-2 border-teal-300 shadow-md rounded-lg p-6 max-w-2xl w-full">
        <div className="w-full sm:w-auto order-0 sm:order-2 m-6 sm:mb-0 flex justify-center ">
          <img
            src={profileImage}
            alt="profileimage"
            className="w-100 h-90 sm:ml-6 ml-0 object-cover rounded-[5%] border border-teal-400"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">
            Profil bearbeiten
          </h2>
          {message && (
            <div
              className={`fixed top-10 left-1/2 transform -translate-x-1/2 text-green-700 border border-green-300 rounded-lg shadow-lg px-6 py-3 text-sm font-medium animate-fade-in ${
                message.includes("Fehler") ? "bg-red-200" : "bg-green-200"
              }`}
            >
              {message}
            </div>
          )}
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
                <span className="text-sm">:kamera:</span>
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
              <option
                value="Freizeit und Unterhaltung
"
              >
                Freizeit und Unterhaltung
              </option>
              <option value="Essen und Trinken">Essen und Trinken</option>
              <option value="Sport und Lifestyle">Sport und Lifestyle</option>
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
                className="bg-teal-500 text-white px-4 py-2 rounded duration-300 hover:bg-teal-600 transition-colors"
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
            className="w-full bg-teal-500 text-white py-2 rounded duration-300 hover:bg-teal-600 transition-colors"
          >
            Speichern
          </button>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow duration-300 hover:bg-red-500"
              onClick={handleDeleteProfile}
            >
              Profil löschen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}