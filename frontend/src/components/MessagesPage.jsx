import { useState, useEffect } from "react";

export function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = () => {
    fetch("http://localhost:3000/chats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        markAllAsRead(); // Mark all messages as read after fetching
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Nachrichten:", error);
        alert("Fehler beim Laden der Nachrichten");
      });
  };

  const markAllAsRead = () => {
    fetch("http://localhost:3000/chats/read-all", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Fehler beim Markieren der Nachrichten als gelesen:", error);
        alert("Fehler beim Markieren der Nachrichten als gelesen");
      });
  };

  const handleReplyChange = (event) => {
    setReplyMessage(event.target.value);
  };

  const handleReplySubmit = (chatId) => {
    fetch(`http://localhost:3000/chats/${chatId}/reply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: replyMessage }),
    })
      .then((res) => res.json())
      .then(() => {
        setReplyMessage("");
        fetchMessages(); // Refresh messages after sending a reply
      })
      .catch((error) => {
        console.error("Fehler beim Senden der Antwort:", error);
        alert("Fehler beim Senden der Antwort");
      });
  };
  
  
  return (
    <div className="zero-section flex justify-center flex-col px-4 py-8">
      <h1 className="text-2xl font-bold mt-16 mb-4">Nachrichten</h1>
      {messages.length === 0 ? (
        <div>Keine Nachrichten</div>
      ) : (
        messages.map((chat) => (
          console.log(chat),
          
          <div key={chat._id} className="p-4 border-b">
            {chat.messages.map((msg) => (
              <div key={msg._id} className="mb-4">
                <h3 className="font-bold">Chat für Job: {chat.title}</h3>
                <div>
                  {chat.participants.map((participant, index) => (
                    <p key={index}><strong>Von:</strong> {participant.username}</p>
                  ))}
                </div>
                <p>{msg.content}</p>
                <p className="text-sm text-gray-500">
                  Gesendet am: {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            <textarea
              value={replyMessage}
              onChange={handleReplyChange}
              className="w-full p-2 border rounded mt-2"
              placeholder="Antwort schreiben..."
            ></textarea>
            <button
              onClick={() => handleReplySubmit(chat._id)}
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