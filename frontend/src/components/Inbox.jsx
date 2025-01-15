import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Inbox() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:3000/chats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUnreadCount(data.filter((msg) => !msg.read).length);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Nachrichten:", error);
        alert("Fehler beim Laden der Nachrichten");
      });
  }, [token]);

<<<<<<< HEAD
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleReplyChange = (e) => {
    setReplyMessage(e.target.value);
  };

  const handleReplySubmit = (jobId) => {
    fetch(`http://localhost:3000/chats/${jobId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: replyMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Antwort gesendet");
        setReplyMessage("");
      })
      .catch((error) => {
        console.error("Fehler beim Senden der Antwort:", error);
        alert("Fehler beim Senden der Antwort");
      });
=======
  const handleNavigate = () => {
    navigate("/messages");
>>>>>>> 28f628609074d7aa60568f0757f2ac12ed81617a
  };

  return (
    <div className="relative">
      <button onClick={handleNavigate} className="relative">
        <i className="fa-solid fa-envelope"><span className="flex flex-col sm:flex-row items-center gap-1 font-sans hover:underline">Nachrichten</span></i>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}