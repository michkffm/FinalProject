import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (input) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input); // Anpassbare Sonderzeichen
    
    if (input.length < minLength) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
    } else if (!hasSpecialChar) {
      setError("Passwort muss mindestens ein Sonderzeichen enthalten.");
    } else {
      setError(""); // Kein Fehler
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) {
      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(text);
            });
          }
          return res.json();
        })
        .then((data) => {
          setMessage("Registrierung erfolgreich!");
          console.log("Registrierung erfolgreich", data);
          localStorage.setItem("username", data.username);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((error) => {
          setMessage("Fehler bei der Registrierung: " + error.message);
          console.error("Fehler bei der Registrierung", error);
        });
    }
  };

  return (
    <div className="position zero-section min-h-screen px-4 py-8 flex justify-center items-center">
      <div className="bg-white bg-opacity-80 border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-lg">
        {message && (
          <div
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 text-white border border-green-300 rounded-lg shadow-lg px-6 py-3 text-sm font-medium animate-fade-in ${
              message.includes("Fehler") ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {message}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-teal-600">
          Registrieren Sie sich
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Benutzername
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={data.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Dein Benutzername"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Passwort
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-teal-500 hover:text-teal-600"
            >
              {showPassword ? (
                <i className="fa-regular fa-eye-slash"></i>
              ) : (
                <i className="fa-regular fa-eye"></i>
              )}
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 w-full font-medium"
          >
            Registrieren
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Bereits registriert?{" "}
          <a href="/login" className="text-teal-600 hover:underline">
            Anmelden
          </a>
        </p>
      </div>
    </div>
  );
}