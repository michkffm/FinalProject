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

  const handleNavigate = () => {
    navigate("/messages");
  };

  return (
    <div className="relative">
      <button onClick={handleNavigate} className="flex flex-col sm:flex-row items-center">
        <span className="flex flex-col sm:flex-row items-center gap-1 hover:underline"><i className="fa-solid fa-comments"></i>Nachrichten</span>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white font-bold rounded-full px-2">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}