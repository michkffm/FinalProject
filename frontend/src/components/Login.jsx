import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [data, setData] = useState({
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
   const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Login fehlgeschlagen");
        }
      })
      .then((data) => {
        console.log("Login erfolgreich", data);
        setMessage("Login erfolgreich!");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.error("Fehler beim Login", error);
      });
  };

  return (
    <div className="flex items-center justify-center mt-72">
      <div className="border-2 border-gray-300 rounded-lg shadow-lg p-8 bg-white w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
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
              value={data.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Passwort:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 ml-44">Login</button>
        </form>
        {message && (
          <div className={`mt-4 p-3 text-white ${message.includes("Fehler") ? "bg-red-500" : "bg-green-500"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
