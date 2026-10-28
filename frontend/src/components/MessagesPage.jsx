import { API_URL } from '../api.js';
import { useState, useEffect, useCallback } from 'react';

export function MessagesPage() {
  const [chats, setChats] = useState([]);
  const [replies, setReplies] = useState({});
  const [cursor, setCursor] = useState(null);
  const [browsingHistory, setBrowsingHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const request = useCallback(async (path, method = 'GET', body) => {
    const response = await fetch(`${API_URL}${path}`, { method,
      headers: { Authorization: `Bearer ${token}`, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Anfrage fehlgeschlagen');
    return data;
  }, [token]);

  const markRead = useCallback(async (chatId, messages) => {
    if (!messages.length) return;
    try { await request(`/chats/${chatId}/read`, 'PATCH', { messageIds: messages.map(message => message._id) }); }
    catch { setError('Der Lesestatus konnte nicht gespeichert werden.'); }
  }, [request]);

  const fetchChats = useCallback(async () => {
    try {
      const response = await request('/chats');
      setChats(response.data);
      setCursor(response.nextCursor);
      await Promise.all(response.data.map(chat => markRead(chat._id, chat.messages)));
    } catch (err) { setError(err.message || 'Nachrichten konnten nicht geladen werden.'); }
  }, [request, markRead]);

  useEffect(() => { fetchChats(); }, [fetchChats]);
  useEffect(() => {
    if (browsingHistory) return;
    const timer = setInterval(fetchChats, 60000);
    return () => clearInterval(timer);
  }, [fetchChats, browsingHistory]);

  const loadChats = async () => {
    if (!cursor || loading) return;
    setLoading(true);
    setError('');
    try {
      const response = await request(`/chats?cursor=${encodeURIComponent(cursor)}`);
      setChats(previous => [...previous, ...response.data.filter(chat => !previous.some(existing => existing._id === chat._id))]);
      setCursor(response.nextCursor);
      setBrowsingHistory(true);
      await Promise.all(response.data.map(chat => markRead(chat._id, chat.messages)));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  const loadOlder = async chat => {
    if (!chat.before || loading) return;
    setLoading(true);
    setError('');
    try {
      const page = await request(`/chats/${chat._id}/messages?before=${encodeURIComponent(chat.before)}`);
      setChats(previous => previous.map(current => current._id === chat._id ? { ...current,
        messages: [...page.messages.filter(message => !current.messages.some(existing => existing._id === message._id)), ...current.messages],
        hasMoreMessages: page.hasMore, before: page.before,
      } : current));
      setBrowsingHistory(true);
      await markRead(chat._id, page.messages);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  const reply = async (event, chatId) => {
    event.preventDefault();
    setSending(chatId);
    setError('');
    try {
      await request(`/chats/${chatId}/reply`, 'POST', { content: replies[chatId] });
      setReplies(previous => ({ ...previous, [chatId]: '' }));
      setBrowsingHistory(false);
      await fetchChats();
    } catch (err) { setError(err.message); }
    finally { setSending(null); }
  };
  const deleteChat = async chatId => {
    try {
      await request(`/chats/${chatId}`, 'DELETE');
      setChats(previous => previous.filter(chat => chat._id !== chatId));
    } catch (err) { setError(err.message); }
  };
  const deleteMessage = async (chatId, messageId) => {
    try {
      await request(`/chats/${chatId}/messages/${messageId}`, 'DELETE');
      setChats(previous => previous.map(chat => chat._id === chatId ? { ...chat, messages: chat.messages.filter(message => message._id !== messageId) } : chat));
    } catch (err) { setError(err.message); }
  };

  return <main className="zero-section min-h-screen px-4 pt-28 pb-8">
    <div className="mx-auto max-w-3xl">
      <div className="filter-heading"><h1 className="results-heading">Nachrichten</h1>
        <button type="button" onClick={() => { setError(''); setBrowsingHistory(false); fetchChats(); }}>Aktualisieren</button></div>
      {browsingHistory && <p className="mb-4">Du liest ältere Nachrichten. Mit „Aktualisieren“ lädst du die neuesten Unterhaltungen.</p>}
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 text-red-800 p-4">{error}</p>}
      {!chats.length && <p>Keine Nachrichten vorhanden.</p>}
      {chats.map(chat => <article key={chat._id} className="job-card mb-6">
        <div className="filter-heading"><h2>Chat für {chat.jobId?.title || 'Gelöschtes Angebot'}</h2>
          <button type="button" className="job-delete" onClick={() => deleteChat(chat._id)}>Chat löschen</button></div>
        {chat.hasMoreMessages && <button type="button" disabled={loading} className="mb-4 underline" onClick={() => loadOlder(chat)}>{loading ? 'Wird geladen …' : 'Ältere Nachrichten laden'}</button>}
        {chat.messages.map(message => <div key={message._id} className={`message-standard mb-4 p-3 rounded-lg ${message.sender?.username === username ? 'message-me' : ''}`}>
          <p className="font-semibold">{message.sender?.username || 'Gelöschtes Konto'}</p>
          <p className="whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs mt-2">{new Date(message.createdAt).toLocaleString()}</p>
          {message.sender?.username === username && <button type="button" className="underline mt-2 text-sm" onClick={() => deleteMessage(chat._id, message._id)}>Nachricht löschen</button>}
        </div>)}
        <form className="job-contact" onSubmit={event => reply(event, chat._id)}>
          <label htmlFor={`reply-${chat._id}`}>Antwort schreiben</label>
          <textarea id={`reply-${chat._id}`} value={replies[chat._id] || ''} onChange={event => setReplies(previous => ({ ...previous, [chat._id]: event.target.value }))} required maxLength={5000} rows={3} />
          <button type="submit" disabled={sending !== null}>{sending === chat._id ? 'Wird gesendet …' : 'Antworten'}</button>
        </form>
      </article>)}
      {cursor && <button type="button" disabled={loading} className="home-search-button" onClick={loadChats}>{loading ? 'Wird geladen …' : 'Weitere Unterhaltungen laden'}</button>}
    </div>
  </main>;
}
