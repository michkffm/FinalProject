import { getSessionUserId } from "../session.js";
import { API_URL } from "../api.js";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";


export function Inbox({setMenuOpen}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = getSessionUserId(token);

  const fetchMessages = useCallback(() => {
    fetch(`${API_URL}/chats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          const unreadMessages = response.data.reduce((count, chat) => {
            return (
              count +
              chat.messages.filter(
                (msg) =>
                  !msg.read && // Nachricht ist ungelesen
                  msg.sender?._id !== userId // Nachricht wurde von jemand anderem gesendet
              ).length
            );
          }, 0);
          setUnreadCount(unreadMessages);
        } else {
          console.error(
            "Fehler beim Laden der Nachrichten: Daten sind kein Array",
            response
          );
        }
      })
      .catch((error) =>
        console.error("Fehler beim Laden der Nachrichten:", error)
      );
  }, [token, userId]);

  const markMessagesAsRead = async () => {
    try {
      const chatsResponse = await fetch(`${API_URL}/chats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const chatsData = await chatsResponse.json();
      if (chatsData.success && Array.isArray(chatsData.data)) {
        for (const chat of chatsData.data) {
          for (const message of chat.messages) {
            if (!message.read && message.sender?._id !== userId) {
              await fetch(
                `${API_URL}/chats/${chat._id}/messages/${message._id}`,
                {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }
          }
        }
        fetchMessages(); // Aktualisiere den Zähler nach dem Lesen
      }
    } catch (error) {
      console.error(
        "Fehler beim Markieren der Nachrichten als gelesen:",
        error
      );
    }
  };

  const handleNavigate = () => {
    markMessagesAsRead().then(() => {
      fetchMessages(); // Refresh unread count after marking as read
      setMenuOpen?.(false);
      navigate("/messages");
    });
  };
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Fetch messages every 30 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [fetchMessages]);
  return (
    <div className="relative">
      <button
        onClick={handleNavigate}
        className="flex flex-col sm:flex-row items-center"
      >
        <i className="fa-solid fa-comments"></i>
        <span className="text-lg font-normal ml-2 hover:underline">Nachrichten</span>
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}