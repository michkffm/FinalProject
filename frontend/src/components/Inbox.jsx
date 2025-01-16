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
        setUnreadCount(data.filter((msg) => !msg.read).length);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Nachrichten:", error);
        alert("Fehler beim Laden der Nachrichten");
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
        alert("Fehler beim Markieren der Nachrichten als gelesen");
      });
  };

  return (
    <div className="relative">
      <button onClick={handleNavigate} className="flex flex-col sm:flex-row items-center">
        <span className="flex flex-col sm:flex-row items-center gap-1 hover:underline"><i className="fa-solid fa-comments"></i>Nachrichten</span>
        {unreadCount > 0 && (
          <span className="bg-red-600 text-white font-bold rounded-full px-2">
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