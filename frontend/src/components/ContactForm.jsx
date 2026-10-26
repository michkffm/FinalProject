import { API_URL } from "../api.js";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

export default function ContactForm() {
  const [subjectChoice, setSubjectChoice] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const handleSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    setSubjectChoice(selectedSubject);
    setData(previous => ({ ...previous, subject: selectedSubject }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      setMessage("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (sending) return;
    const subjects = { support: "Support-Anfrage", feedback: "Feedback", "profile-change": "Profil ändern", "profile-delete": "Profil löschen", "service-delete": "Dienstleistung löschen" };
    const subject = subjectChoice === "custom" ? customSubject.trim() : subjects[subjectChoice];
    if (!subject || !data.message.trim()) { setMessage("Bitte Betreff und Nachricht ausfüllen."); return; }
    setSending(true);
    fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, subject }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then(() => {
        setData({
          email: "",
          subject: "",
          message: "",
        });
        setSubjectChoice("");
        setCustomSubject("");
        setMessage("Nachricht erfolgreich gesendet!");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      })
      .catch((error) => {
        try {
          const err = JSON.parse(error.message);
          setMessage(err.error || "Unbekannter Fehler.");
        } catch {
          setMessage("Fehler beim Senden der Nachricht.");
        }
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }).finally(() => setSending(false));
  };

  return (
    <div className="position flex justify-center items-center flex-col zero-section min-h-screen px-4 py-8">
      {/* Erfolgreich-Nachricht */}
      {message ? (
        <p className="text-2xl sm:text-4xl font-bold text-center text-teal-400 mt-10">
          {message}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-40 border-2 border-teal-300 shadow-lg mt-14 p-8 w-full max-w-4xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-teal-600">
            Kontaktformular
          </h2>
          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email Adresse:
            </label>
            <input
              id="email"
              type="email"
              required
              name="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-teal-400"
              placeholder="max@musterman.com"
            />
          </div>

          {/* Betreff mit Dropdown */}
          <div className="mb-6">
            <label
              htmlFor="subject"
              className="block text-gray-700 font-semibold mb-2"
            >
              Betreff:
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={subjectChoice}
              onChange={handleSubjectChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-teal-400"
            >
              <option value="" disabled>
                Betreff auswählen
              </option>
              <option value="support">Support-Anfrage</option>
              <option value="feedback">Feedback</option>
              <option value="profile-change">Profil ändern</option>
              <option value="profile-delete">Profil löschen</option>
              <option value="service-delete">Dienstleistung löschen</option>
              <option value="custom">Sonstiges (bitte angeben)</option>
            </select>
            {subjectChoice === "custom" && (
              <input
                type="text"
                name="customSubject"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                maxLength={120}
                required
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-teal-400"
                placeholder="Bitte Betreff angeben"
              />
            )}
          </div>

          {/* Nachricht */}
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Ihre Nachricht:
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              maxLength={5000}
              required
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-teal-400"
              placeholder="Beschreibe Dein Anliegen..."
            />
          </div>

          {/* Senden-Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg duration-300 hover:bg-teal-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {sending ? "Wird gesendet..." : "Senden"}
          </button>
        </form>
      )}

      {/* GitHub-Links */}
      <div className="flex flex-wrap justify-center items-center mt-10 gap-8 sm:gap-20">
        {[
          { name: "Pacome", link: "https://github.com/Pacome-Adoufack" },
          { name: "Sükrü", link: "https://github.com/Okyanuspol" },
          { name: "Bilal", link: "https://github.com/webdevbfb" },
          { name: "Michael", link: "https://github.com/michkffm" },
        ].map(({ name, link }) => (
          <div
            key={name}
            className="flex flex-col items-center transition-transform duration-300 hover:scale-110"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-600"
            >
              <FaGithub className="text-5xl sm:text-6xl" />
            </a>
            <span className="mt-2 text-lg font-semibold text-teal-500 hover:text-teal-600">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
