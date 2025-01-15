import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Inbox() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
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
        setMessages(data);
        setUnreadCount(data.filter((msg) => !msg.read).length);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Nachrichten:", error);
        alert("Fehler beim Laden der Nachrichten");
      });
  }, [token]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleReplyChange = (e) => {
    setReplyMessage(e.target.value);
  };

  const handleReplySubmit = (msgId) => {
    fetch(`http://localhost:3000/chats/${msgId}/reply`, {
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
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative">
        <i className="fa-solid fa-envelope"><span className="flex flex-col sm:flex-row items-center gap-1 font-sans hover:underline">Nachrichten</span></i>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg">
          {messages.length === 0 ? (
            <div className="p-4">Keine Nachrichten</div>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className="p-4 border-b">
                <h3 className="font-bold">Von: {msg.senderId}</h3>
                <p>{msg.message}</p>
                <p className="text-sm text-gray-500">
                  Gesendet am: {new Date(msg.createdAt).toLocaleString()}
                </p>
                <textarea
                  value={replyMessage}
                  onChange={handleReplyChange}
                  className="w-full p-2 border rounded mt-2"
                  placeholder="Antwort schreiben..."
                ></textarea>
                <button
                  onClick={() => handleReplySubmit(msg._id)}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Antworten
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}