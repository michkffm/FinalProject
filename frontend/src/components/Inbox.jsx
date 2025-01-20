import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Inbox() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchMessages = () => {
    fetch("http://localhost:3000/chats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUnreadCount(data.reduce((count, chat) => {
            return count + chat.messages.filter((msg) => !msg.read).length;
          }, 0));
        } else {
          console.error("Fehler beim Laden der Nachrichten: Daten sind kein Array", data);
        }
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Nachrichten:", error);
      });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Fetch messages every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [token]);

  const handleNavigate = () => {
    markAllAsRead().then(() => {
      fetchMessages(); // Refresh messages after marking all as read
      navigate("/messages");
    });
  };

  const markAllAsRead = () => {
    return fetch("http://localhost:3000/chats/read-all", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setUnreadCount(0); // Ensure unread count is set to 0 after marking all as read
      })
      .catch((error) => {
        console.error("Fehler beim Markieren der Nachrichten als gelesen:", error);
      });
  };

  return (
    <div className="relative">
      <button onClick={handleNavigate} className="flex flex-col sm:flex-row items-center">
        <i className="fa-solid fa-comments"></i>
        <span className="text-lg font-normal ml-2">Nachrichten</span>
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}