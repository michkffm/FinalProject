import { useState, useEffect } from "react";

export function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [replyMessages, setReplyMessages] = useState({});
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const decodeToken = (token) => {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = atob(payloadBase64);
    const payload = JSON.parse(payloadDecoded);
    return payload.userId;
  };
  const userId = decodeToken(token);
  const username = localStorage.getItem("username");
  console.log("username", username);
  console.log("userId", userId);

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
          console.log(response.data);
        } else {
          console.error(
            "Fehler beim Laden der Nachrichten: Daten sind kein Array",
            response
          );
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

  const handleDelete = async (chatId) => {
    try {
      const chatIdString = chatId._id || chatId;

      const response = await fetch(
        `http://localhost:3000/chats/${chatIdString}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      fetchMessages();
    } catch (err) {
      setError(err.message || "Fehler beim Löschen des Chats.");
    }
  };
  const handleDeleteMessage = async (chatId, messageId) => {
    try {
      const chatIdString = chatId._id || chatId;
      const messageIdString = messageId._id || messageId;

      // API-Request zum Löschen der Nachricht
      const response = await fetch(
        `http://localhost:3000/chats/${chatIdString}/messages/${messageIdString}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      setMessages((prevMessages) =>
        prevMessages.map((chat) =>
          chat._id === chatIdString
            ? {
                ...chat,
                messages: chat.messages.filter(
                  (msg) => msg._id !== messageIdString
                ),
              }
            : chat
        )
      );
    } catch (err) {
      setError(err.message || "Fehler beim Löschen der Nachricht.");
    }
  };

  return (
    <div className="zero-section min-h-screen px-4 py-8 sm:mt-0 mt-8 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center sm:mt-16 mt-10 items-center min-h-screen sm:w-3/6 w-full mt-6">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((chat) => (
            <div
              key={chat._id}
              className="p-6 mb-6 w-full bg-green shadow-lg rounded-lg bg-white bg-opacity-40 border-2 border-teal-300"
            >
              <div className="flex justify-center items-center py-6 relative">
                <h3 className="text-2xl sm:text-3xl text-teal-600 font-bold bg-white rounded-lg shadow-lg p-4 bg-opacity-80 sm:w-2/6 w-3/4 mb-6 flex items-center justify-center border border-teal-300">
                  Chat für {chat.jobId?.title || "Unbekannt"}
                </h3>
                <div className="absolute top-8 right-80">
                  <button onClick={() => handleDelete(chat._id)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              {/* Textarea für Nachrichtenantwort */}
              <div>
                {chat.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`mb-4 message-standard relative ${
                      username === msg.sender.username ? "message-me" : ""
                    }`}
                  >
                    <p>
                      {username === msg.sender
                        ? chat.participants
                            .filter(
                              (participant) => participant.username !== username
                            )
                            .map((participant) => participant.username)
                            .join(", ")
                        : typeof msg.sender === "object"
                        ? msg.sender.username
                        : msg.sender}{" "}
                      {/* Hier wird sichergestellt, dass nur ein String gerendert wird */}
                    </p>

                    <p>{msg.content}</p>
                    <p className="text-sm text-gray-500">
                      Gesendet am: {new Date(msg.createdAt).toLocaleString()}
                    </p>
                    <div className="absolute right-5 top-8">
                      <button
                        onClick={() =>
                          handleDeleteMessage(chat._id, msg._id)
                        }
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <textarea
                value={replyMessages[chat._id] || ""}
                onChange={(e) => handleReplyChange(chat._id, e)}
                className="w-full p-3 border rounded-lg mt-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Antwort schreiben..."
              ></textarea>

              {/* Antwort Button */}
              <button
                onClick={() => handleReplySubmit(chat._id)}
                className="mt-4 w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Antworten
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-lg">Keine Nachrichten...</div>
        )}
      </div>
    </div>
  );
}
