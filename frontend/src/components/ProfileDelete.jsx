import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function ProfileDelete() {
  const [user, setUser] = useState(null); // Speichert den Benutzer
  const [error, setError] = useState(null); // Fehlerzustand
  const [message, setMessage] = useState(""); // Erfolgsmeldungen
  const { id } = useParams(); // ID aus der URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Daten des Benutzers abrufen
  const fetchUser = () => {
    fetch(`http://localhost:3000/users/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data); // Benutzerdaten in den State setzen
      })
      .catch((err) => {
        setError(err.message); // Fehler setzen
      });
  };

  useEffect(() => {
    fetchUser(); // Beim Laden der Komponente Benutzer abrufen
  }, [id]);

  // Benutzer löschen
  const handleDelete = () => {
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete user");
        }
        return res.json();
      })
      .then(() => {
        setMessage("Profil erfolgreich gelöscht!");
        setTimeout(() => {
          navigate("/"); // Nach erfolgreicher Löschung zurück zur Startseite
        }, 2000);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // Fehlermeldung anzeigen
  if (error) {
    return <div className="mt-40 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-40">
      <h1 className="text-2xl font-bold mb-4">Profil löschen</h1>

      {message && <p className="text-green-500">{message}</p>}

      {user ? (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Benutzerdetails:</h2>
          <pre className="bg-gray-100 p-2 rounded mb-4">
            {JSON.stringify(user, null, 2)}
          </pre>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Profil endgültig löschen
          </button>
        </div>
      ) : (
        !message && <p>Benutzerdaten werden geladen...</p>
      )}
    </div>
  );
}
