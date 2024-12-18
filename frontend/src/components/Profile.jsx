import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
          profilePhoto: data.profilePhoto ? data.profilePhoto: "",
          role: data.role ? data.role: [],
          profession: data.profession ? data.profession: "",
          location: data.location ? data.location: "",
          description: data.description ? data.description : ""
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
    <div className="sm:mt-0 mt-32 min-h-screen bg-gray-50 flex justify-center items-center px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-lg border rounded-lg p-6 max-w-4xl w-full">
        
        {/* Profilbild */}
        <div className="w-full sm:w-auto order-1 sm:order-2 mb-6 sm:mb-0 sm:ml-6 ml-0 flex  justify-center">
          <img
            src={profileImage}
            alt="Profilbild"
            className="w-100 h-100 object-cover rounded-[5%] border border-teal-400"
          />
        </div>
  
        {/* Formular */}
        <form onSubmit={handleSubmit} className="w-full sm:w-3/5 order-2 sm:order-1 space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Profil bearbeiten</h2>
  
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}
  
          {/* Beschreibung */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Beschreibung
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-400"
              placeholder="Gebe hier deine Beschreibung ein..."
            />
          </div>
  
          {/* Berufskategorie */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Berufskategorie
            </label>
            <select
              name="profession"
              value={data.profession}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-400"
            >
              <option value="" disabled>Bitte wählen</option>
              <option value="Elektrik">Elektrik</option>
              <option value="Babysitting">Babysitting</option>
              <option value="Heizung">Heizung</option>
              <option value="Nachhilfe">Nachhilfe</option>
              <option value="IT">IT</option>
            </select>
          </div>
  
          {/* Rollen */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Rollen</label>
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
  
          {/* Standort */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Standort</label>
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