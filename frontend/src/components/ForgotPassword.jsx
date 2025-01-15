import { useState } from "react";
import { useNavigate } from "react-router-dom";
export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }
    setError("");
    setMessage("");
    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // E-Mail korrekt senden
      });
      // Überprüfen, ob die Antwort erfolgreich ist
      const data = await response.json();
      if (!response.ok) {
        // Serverfehler behandeln
        setError(data.message || "Fehler beim Senden der E-Mail.");
        return;
      }
      setMessage("E-Mail zum Zurücksetzen des Passworts wurde gesendet.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      // Fehler, wenn die Antwort nicht im JSON-Format vorliegt
      setError("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
    }
  };
  return (
    <div className="zero-section min-h-screen px-4 py-8 flex justify-center items-center">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-semibold text-center text-teal-600 mb-6">
      Passwort vergessen?
    </h2>
    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    {message && <p className="text-green-500 text-center mb-4">{message}</p>}
    <form onSubmit={handleSubmit}>
      <label htmlFor="email" className="block text-lg font-medium text-gray-700">
        E-Mail
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="E-Mail eingeben"
        required
      />
      <button
        type="submit"
        className="w-full py-3 mt-4 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300"
      >
        Senden
      </button>
    </form>
    <p className="text-center text-sm text-gray-600 mt-4">
      Zurück zur{" "}
      <a href="/login" className="text-teal-600 hover:underline">
        Anmeldung
      </a>
    </p>
  </div>
    </div>
  );
}