import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { JobRatings } from "./JobRatings.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext } from "react";

export function Category() {
  const [message, setMessage] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const username = localStorage.getItem("username");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { userId } = useContext(MyContext);
  const { name } = useParams();
  const [filters, setFilters] = useState({
    name: "",
    price: "all",
    location: "",
  });

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
        console.log("Abgerufene Daten:", data);

        setData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Laden der Kategorie.");
        }
      });
  }, [name]);

  useEffect(() => {
    let filtered = data;
    if (filters.name) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.price !== "all") {
      if (filters.price === "low") {
        filtered = filtered.filter((job) => job.price < 50);
      } else if (filters.price === "medium") {
        filtered = filtered.filter(
          (job) => job.price >= 50 && job.price <= 100
        );
      } else if (filters.price === "high") {
        filtered = filtered.filter((job) => job.price > 100);
      }
    }
    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    setFilteredData(filtered);
  }, [filters, data]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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
  
    fetch("http://localhost:3000/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        jobId,
        message: contactMessage.message,
      }),
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
        setMessage("Nachricht erfolgreich gesendet!");
        setContactMessages((prevMessages) => ({
          ...prevMessages,
          [jobId]: { message: "" },
        }));
        setTimeout(() => {
          setMessage("");
        }, 3000);
      })
      .catch((error) => {
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Senden der Nachricht.");
        }
        setTimeout(() => {
          setMessage("");
        }, 3000);
      });
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      setData((prevState) => prevState.filter((job) => job._id !== jobId));
      setMessage("Dienstleistung erfolgreich gelöscht!");
      setTimeout(() => {
        setMessage("");
      }, 2000)
    } catch (err) {
      setMessage(err.message || "Fehler beim Löschen des Angebots.");
    }
  };

  console.log(userId);

  return (
    <div className="zero-section min-h-screen px-4 py-8 flex justify-center items-start">
      <div className="container mx-auto sm:mt-14 mt-10">
        {message && (
          <div
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 text-white border border-green-300 rounded-lg shadow-lg px-6 py-3 text-sm font-medium animate-fade-in ${
              message.includes("Fehler") ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Filter und Jobanzeigen */}
        <div className="mb-6 flex flex-wrap gap-4 ">
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Nach Name filtern"
            className="p-2 border border-gray-300 rounded-md shadow-sm"
          />
          <select
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="all">Alle Preise</option>
            <option value="low">Unter 50€</option>
            <option value="medium">50€ - 100€</option>
            <option value="high">Über 100€</option>
          </select>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Nach Standort filtern"
            className="p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.map((job) => (
            <div
              key={job._id}
              className="bg-white bg-opacity-40 border-2 border-teal-300 rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-end relative">
                {job.createdBy && username === job.createdBy.username && (
                  <button
                    onClick={() => handleDelete(job._id)}
                  >
                     <i className="fa-solid fa-trash-can"></i>
                     <span className="tooltip">Diensleistung löschen</span>
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-700 mb-2">
                {job.title}
              </h2>
              <div>
                {job.createdBy && job.createdBy.username ? (
                  <p className="text-xl font-bold text-teal-500 mb-2">
                    {job.createdBy.username}
                  </p>
                ) : (
                  <p className="text-xl font-bold text-teal-500 mb-2">
                    Unbekannter Ersteller
                  </p>
                )}
              </div>

              <h3 className="text-sm text-teal-500 font-medium">
                {job.category}
              </h3>
              <p className="text-gray-600 mt-2">
                <span className="font-medium text-gray-800">Kontakt:</span>{" "}
                {job.contact}
              </p>
              <p className="text-gray-600 mt-1">{job.description}</p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium text-gray-800">Standort:</span>{" "}
                {job.location}
              </p>
              <p className="text-lg font-semibold text-teal-600 mt-3">
                Preis: {job.price}€
              </p>
              <div className="flex justify-between mt-2">
                <Link to={`/ratings/${job._id}`} className="w-5/12">
                  <button className="w-full bg-blue-500 text-white py-2 rounded duration-300 hover:bg-teal-600 transition-colors">
                    Bewerten
                  </button>
                </Link>
                <Link
                  to={`/payment/${job._id}?price=${job.price}`}
                  className="w-5/12"
                >
                  <button className="w-full bg-blue-500 text-white py-2 rounded duration-300 hover:bg-teal-600 transition-colors ">
                    Buchen
                  </button>
                </Link>
              </div>
              <form
                onSubmit={(e) => handleContactSubmit(e, job._id)}
                className="mt-4"
              >
                <textarea
                  name="message"
                  value={contactMessages[job._id]?.message || ""}
                  onChange={(e) => handleContactChange(e, job._id)}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Gib hier deine Nachricht ein..."
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-teal-500 text-white py-2 rounded duration-300 hover:bg-teal-600 transition-colors mt-2"
                >
                  Nachricht senden
                </button>
              </form>
              <JobRatings jobId={job._id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
