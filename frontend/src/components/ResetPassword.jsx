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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-green-500 text-xl">Passwort erfolgreich zurückgesetzt!</h2>
          <p>Sie können sich jetzt mit Ihrem neuen Passwort anmelden.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 text-white p-2 rounded mt-4"
          >
            Zum Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center"></h2>
        {tokenValid === false && <p className="text-red-500 mb-4">token ist abgelaufen</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Neues Passwort
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Bestätigen Sie das neue Passwort
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-500'} text-white`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}