import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function Category() {
  const [message, setMessage] = useState("");
  const [token, ] = useState(localStorage.getItem("token"));
  const [data, setData] = useState([]);
  const {name} = useParams();
  const [contactMessages, setContactMessages] = useState({});

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

  const handleContactChange = (e, jobId) => {
    const { name, value } = e.target;
    setContactMessages((prevMessages) => ({
      ...prevMessages,
      [jobId]: {
        ...prevMessages[jobId],
        [name]: value,
      },
    }));
  };

  const handleContactSubmit = (e, jobId) => {
    e.preventDefault();
    const contactMessage = contactMessages[jobId] || { message: "" };
    fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipientId: jobId, message: contactMessage.message }),
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
        setMessage("Nachricht erfolgreich gesendet!");
        setContactMessages((prevMessages) => ({
          ...prevMessages,
          [jobId]: { message: "" },
        }));
      })
      .catch((error) => {
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Senden der Nachricht.");
        }
      });
  };

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
              <form onSubmit={(e) => handleContactSubmit(e, job._id)} className="mt-4">
                <textarea
                  name="message"
                  value={contactMessages[job._id]?.message || ""}
                  onChange={(e) => handleContactChange(e, job._id)}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Gebe hier deine Nachricht ein..."
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors mt-2"
                >
                  Nachricht senden
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}
