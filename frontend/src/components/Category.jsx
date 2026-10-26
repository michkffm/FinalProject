import { JobCard } from "./JobCard.jsx";
import { JobFilters } from "./JobFilters.jsx";
import { filterJobs, emptyJobFilters } from "../filterJobs.js";
import { API_URL } from "../api.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function Category() {
  const [message, setMessage] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const username = localStorage.getItem("username");
  const [data, setData] = useState([]);
  const { name } = useParams();
  const [filters, setFilters] = useState({ ...emptyJobFilters });
  const [loading, setLoading] = useState(true);

  const [contactMessages, setContactMessages] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setData([]);
    setMessage("");
    fetch(`${API_URL}/jobs?category=${encodeURIComponent(name)}`, {
      signal: controller.signal,
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
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Laden der Kategorie.");
        }
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [name, token]);

  const filteredData = filterJobs(data, filters);

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

    fetch(`${API_URL}/chats`, {
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
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
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

        <h1 className="results-heading">{name}</h1>
        <JobFilters filters={filters} onChange={handleFilterChange}
          onReset={() => setFilters({ ...emptyJobFilters })}

          count={filteredData.length} loading={loading} />
        {!loading && filteredData.length === 0 && <p className="empty-results">Keine passenden Angebote gefunden. Passe die Filter oder den Suchbegriff an.</p>}
        <div className="job-grid">
          {filteredData.map(job => <JobCard key={job._id} job={job}
            canDelete={Boolean(job.createdBy && username === job.createdBy.username)} onDelete={handleDelete}
            contactMessage={contactMessages[job._id]?.message} onContactChange={handleContactChange}
            onContactSubmit={handleContactSubmit} showRatings />)}
        </div>
      </div>
    </div>
  );
}
