import { useState, useEffect } from "react";

export function Category() {
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();
    const [data, setData] = useState({})

    useEffect(()=>{
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
    },[])

    return (
        <div>
        <h1>Category</h1>
        </div>
    );
}