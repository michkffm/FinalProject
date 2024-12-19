import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function Category() {
  const [, setMessage] = useState("");
  const [token, ] = useState(localStorage.getItem("token"));
  const [data, setData] = useState([]);
  const {name} = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/jobs?category=${name}`, {
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
        setData(data);
        console.log(data);
        setMessage("kategorie erfolgreich geladen!");
      })
      .catch((error) => {
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Laden der Kategorie.");
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="container mx-auto mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((job) => (
            <div key={job._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-700 mb-2">{job.title}</h2>
              <h3 className="text-sm text-teal-500 font-medium">{job.category}</h3>
              <p className="text-gray-600 mt-2">
                <span className="font-medium text-gray-800">Kontakt:</span> {job.contact}
              </p>
              <p className="text-gray-600 mt-1">{job.description}</p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium text-gray-800">Standort:</span> {job.location}
              </p>
              <p className="text-lg font-semibold text-teal-600 mt-3">
                Preis: {job.price}€
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}
