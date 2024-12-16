import { useState, useEffect } from "react";

export function ProfileDelete() {
  const [profiles, setProfiles] = useState([]); // Mehrere Profile
  const [error, setError] = useState(null);

  // Profile abrufen
  const fetchProfiles = () => {
    fetch(`http://localhost:3000/users`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch profiles");
        }
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data)) {
          setProfiles(data); // Array von Profilen setzen
        } else {
          throw new Error("Invalid data format");
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

    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete profile");
        }
        return res.json();
      })
      .then(() => {
        // Gelöschtes Profil aus der Liste entfernen
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== id)
        );
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Profile löschen</h1>
      <div className="profiles-list">
        {profiles.map((profile) => (
          <div
            key={profile._id}
            className="border-2 border-gray-300 rounded-lg shadow-lg p-4 mb-4 bg-white"
          >
            <h2 className="text-lg font-semibold">{profile.name}</h2>
            <p>Beruf: {profile.profession}</p>
            <p>Standort: {profile.location}</p>
            <button
              className="btn bg-red-500 text-white mt-4"
              onClick={() => handleDelete(profile._id)}
            >
              Profil löschen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
