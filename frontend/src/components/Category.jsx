import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Category() {
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [data, setData] = useState({});

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
