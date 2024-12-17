import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function ProfileDelete() {
  const { id } = useParams();
  console.log("ID:", id);
  
  const [profiles, setProfiles] = useState([]); // Profile-Liste
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Für Feedback während des Löschens

  // Profile abrufen
  const fetchProfiles = () => {
    fetch(`http://localhost:3000/users/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fehler beim Abrufen der Profile.");
        }
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data)) {
          setProfiles(data); // Profile setzen
        } else {
          throw new Error("Unerwartetes Datenformat.");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Profil löschen
  const handleDelete = (id) => {
    if (!id) {
      console.error("Ungültige ID übergeben:", id);
      return;
    }

    setIsDeleting(true); // Löschen-Status setzen

    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fehler beim Löschen des Profils.");
        }
        return res.json();
      })
      .then(() => {
        // Profil aus der Liste entfernen
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== id)
        );
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsDeleting(false); // Löschen-Status zurücksetzen
      });
  };

  if (error) {
    return <div className="text-red-500">Fehler: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile löschen</h1>
      <div className="profiles-list">
        {profiles.length === 0 ? (
          <p>Keine Profile gefunden.</p>
        ) : (
          profiles.map((profile) => (
            <div
              key={profile._id}
              className="border-2 border-gray-300 rounded-lg shadow-lg p-4 mb-4 bg-white"
            >
              <h2 className="text-lg font-semibold">{profile.name}</h2>
              <p>Beruf: {profile.profession}</p>
              <p>Standort: {profile.location}</p>
              <button
                className={`btn mt-4 ${
                  isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                onClick={() => handleDelete(profile._id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Löschen..." : "Profil löschen"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
