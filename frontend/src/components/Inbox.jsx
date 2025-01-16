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
};

export function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
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
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Nachrichten:", error);
        alert("Fehler beim Laden der Nachrichten");
      });
  }, [token]);

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
        // Nachrichten erneut laden, um die Antwort anzuzeigen
        fetch("http://localhost:3000/chats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setMessages(data);
          });
      })
      .catch((error) => {
        console.error("Fehler beim Senden der Antwort:", error);
        alert("Fehler beim Senden der Antwort");
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nachrichten</h1>
      {messages.length === 0 ? (
        <div>Keine Nachrichten</div>
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
  );
}