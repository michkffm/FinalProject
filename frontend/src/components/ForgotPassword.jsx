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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Passwort vergessen?</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-lg font-medium">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="E-Mail eingeben"
            required
          />
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Senden
          </button>
        </form>
      </div>
    </div>
  );
}