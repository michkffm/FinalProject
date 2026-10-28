import { API_URL } from "../api.js";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";


export function Inbox({setMenuOpen}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchMessages = useCallback(() => {
    fetch(`${API_URL}/chats/unread`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (!res.ok) throw new Error('Zähler nicht verfügbar'); return res.json(); })
      .then(response => setUnreadCount(response.unreadCount || 0))
      .catch(() => setUnreadCount(0));
  }, [token]);

  const handleNavigate = () => {
    setMenuOpen?.(false);
    navigate('/messages');
  };
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Only a lightweight unread count is polled.
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