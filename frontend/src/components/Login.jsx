import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState(""); // Zustand für Email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saveEmail = localStorage.getItem("email");
    const savePassword = localStorage.getItem("password");
    if (saveEmail && savePassword) {
      setEmail(saveEmail);
      setPassword(savePassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
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
        setMessage("Login erfolgreich!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);

        setIsLoggedIn(true);

        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      })
      .catch((error) => {
        setMessage("Fehler beim Login: " + error.message);
      });
  };

  return (
    <div className="zero-section min-h-screen px-4 py-8 flex justify-center items-center">
      <div className="bg-white bg-opacity-40 border-2 border-teal-300 rounded-lg shadow-lg p-8 bg-green w-full max-w-lg bg-opacity-70">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 text-white border border-green-300 rounded-lg shadow-lg px-6 py-3 text-sm font-medium animate-fade-in ${
                message.includes("Fehler") ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {message}
            </div>
          )}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-800">
              Login
            </h2>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-Mail:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Passwort:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500 hover:text-teal-600"
              >
                {showPassword ? (
                  <i className="fa-regular fa-eye-slash"></i>
                ) : (
                  <i className="fa-regular fa-eye"></i>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-700"
            >
              Angemeldet bleiben
            </label>
          </div>
          <button
            type="submit"
            className="bg-teal-400 text-white py-2 px-4 rounded duration-300 hover:bg-teal-500 w-full"
          >
            Login
          </button>
          <div>
            <button className="w-full bg-teal-400 text-white py-2 rounded duration-300 hover:bg-teal-600 transition-colors mt-2">
              <Link to="/passwort-vergessen">Passwort vergessen?</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
