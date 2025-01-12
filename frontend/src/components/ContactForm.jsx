import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function ContactForm() {
  const [state, handleSubmit] = useForm("mzzblene");
  const navigate = useNavigate();
  const [customSubject, setCustomSubject] = useState(false);

  useEffect(() => {
    if (state.succeeded) {
      setTimeout(() => {
        navigate("/");
      }, 8000);
    }
  }, [state.succeeded, navigate]);

  return (
    <div className="sm:mt-32 mt-40 sm:mb-20 mb-5 px-4 sm:px-0">
      {/* Erfolgreich-Nachricht */}
      {state.succeeded ? (
        <p className="text-2xl sm:text-4xl font-bold text-center text-teal-400 mt-10">
          Du hast erfolgreich Deine Nachricht verschickt!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"
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
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-teal-400"
              placeholder="max@musterman.com"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-red-500 text-sm mt-1"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-teal-400"
              onChange={(e) => setCustomSubject(e.target.value === "custom")}
            >
              <option value="" disabled selected>
                Betreff auswählen
              </option>
              <option value="support">Support-Anfrage</option>
              <option value="feedback">Feedback</option>
              <option value="profile-change">Profil ändern</option>
              <option value="profile-delete">Profil löschen</option>
              <option value="service-delete">Dienstleistung löschen</option>
              <option value="custom">Sonstiges (bitte angeben)</option>
            </select>
            {customSubject && (
              <input
                type="text"
                name="customSubject"
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-teal-400"
                placeholder="Bitte Betreff angeben"
              />
            )}
            <ValidationError
              prefix="Subject"
              field="subject"
              errors={state.errors}
              className="text-red-500 text-sm mt-1"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-teal-400"
              placeholder="Beschreibe Dein Anliegen..."
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Senden-Button */}
          <button
            type="submit"
            disabled={state.submitting}
            className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Senden
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
