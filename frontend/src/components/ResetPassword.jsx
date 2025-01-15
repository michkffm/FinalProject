import { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  useEffect(() => {
     fetch(`http://localhost:3000/reset-password/${token}`)
     .then(res => {
        if(res.ok) {
          // token is valid
           setTokenValid(true);
           return;
        }
        setTokenValid(false);
     })
  },[]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }
    setLoading(true);
    console.log(token);
    try {
      const response = await fetch(`http://localhost:3000/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Das Passwort konnte nicht zurückgesetzt werden. Versuchen Sie es erneut.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut");
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="zero-section min-h-screen px-4 py-8 flex justify-center items-center">
  <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md text-center w-full max-w-sm">
    <h2 className="text-teal-600 text-2xl font-semibold mb-4">
      Passwort erfolgreich zurückgesetzt!
    </h2>
    <p className="text-gray-700 mb-6">
      Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
    </p>
    <button
      onClick={() => navigate("/login")}
      className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-4 focus:ring-teal-300"
    >
      Zum Login
    </button>
  </div>
</div>

    );
  }
  return (
    <div className="zero-section min-h-screen px-4 py-8 flex justify-center items-center">
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md w-full max-w-sm">
    <h2 className="text-2xl font-semibold text-center text-teal-600 mb-6">
      Passwort zurücksetzen
    </h2>
    {tokenValid === false && (
      <p className="text-red-500 text-center mb-4">
        Token ist abgelaufen
      </p>
    )}
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Neues Passwort
        </label>
        <input
          id="newPassword"
          type="password"
          placeholder="Neues Passwort eingeben"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Bestätigen Sie das neue Passwort
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Neues Passwort bestätigen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      <button
        type="submit"
        className={`w-full py-3 rounded-md text-white ${
          loading ? "bg-gray-400" : "bg-teal-500 hover:bg-teal-600"
        } focus:outline-none focus:ring-4 focus:ring-teal-300`}
        disabled={loading}
      >
        {loading ? "Wird geladen..." : "Passwort zurücksetzen"}
      </button>
    </form>
  </div>
    </div>
  );
}