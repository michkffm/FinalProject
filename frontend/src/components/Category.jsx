import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Category() {
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [contactMessages, setContactMessages] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/jobs", {
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
        setMessage("Kategorie erfolgreich geladen!");
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
    <div className="mt-40">
      <div className="flex flex-wrap justify-center">
        {data.map((job) => (
          <div key={job._id} className="w-1/4 p-4">
            <div className="border-2 border-gray-300 rounded-lg shadow-lg p-8 bg-white">
              <h2 className="text-lg font-bold">{job.title}</h2>
              <h3 className="text-sm text-gray-500">{job.category}</h3>
              <p className="mt-2">Contact: {job.contact}</p>
              <p className="mt-2">Description: {job.description}</p>
              <p className="mt-2">Location: {job.location}</p>
              <p className="mt-2 font-semibold">Price: ${job.price}</p>
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
          </div>
        ))}
      </div>
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
  );
}