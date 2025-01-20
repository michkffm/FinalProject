import { useState, useEffect } from "react";

export function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [replyMessages, setReplyMessages] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 60000); // 60000 ms = 1 Minute
    return () => clearInterval(interval); // Cleanup function to clear the interval
  }, [token]);

  const fetchMessages = () => {
    fetch("http://localhost:3000/chats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error("Fehler beim Laden der Nachrichten: Daten sind kein Array", response);
        }
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Nachrichten:", error);
      });
  };

  const handleReplyChange = (chatId, event) => {
    setReplyMessages({
      ...replyMessages,
      [chatId]: event.target.value,
    });
  };

  const handleReplySubmit = (chatId) => {
    const replyMessage = replyMessages[chatId];
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
        setReplyMessages({
          ...replyMessages,
          [chatId]: "",
        });
        fetchMessages(); // Refresh messages after sending a reply
      })
      .catch((error) => {
        console.error("Fehler beim Senden der Antwort:", error);
      });
  };

  return (
    <div className="zero-section flex justify-center flex-col px-4 py-8">
      <h1 className="text-2xl font-bold mt-16 mb-4">Nachrichten</h1>
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((chat) => (
          <div key={chat._id} className="p-4 border-b">
            <h3 className="font-bold">Chat für Job: {chat.jobId?.title || "Unbekannt"}</h3>
            {chat.messages.map((msg) => (
              <div key={msg._id} className="mb-4">
                <div>
                  {chat.participants.map((participant, index) => (
                    <p key={index}>
                      <strong>An:</strong> {participant.username}
                    </p>
                  ))}
                </div>
                <p>{msg.content}</p>
                <p className="text-sm text-gray-500">
                  Gesendet am: {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            <textarea
              value={replyMessages[chat._id] || ""}
              onChange={(e) => handleReplyChange(chat._id, e)}
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
      ) : (
        <div>Lade Nachrichten...</div>
      )}
    </div>
  );
}