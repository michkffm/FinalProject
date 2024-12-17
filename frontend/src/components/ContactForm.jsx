import { useForm, ValidationError } from '@formspree/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

export default function ContactForm() {
  const [state, handleSubmit] = useForm("mzzblene");
  const navigate = useNavigate();

  useEffect(() => {
    if (state.succeeded) {
      setTimeout(() => {
        navigate('/');
      }, 2000); // 2 Sekunden Verzögerung vor der Umleitung
    }
  }, [state.succeeded, navigate]);

  return (
    <div className="mt-40"> {/* Fügt einen größeren oberen Rand hinzu */}
      {state.succeeded ? (
        <p className="text-4xl font-bold text-center text-teal-400">Du hast erfolgreich Deine Nachricht verschickt!</p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address:</label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <ValidationError 
              prefix="Email" 
              field="email"
              errors={state.errors}
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Ihre Nachricht:</label>
            <textarea
              id="message"
              name="message"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <ValidationError 
              prefix="Message" 
              field="message"
              errors={state.errors}
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <button type="submit" disabled={state.submitting} className="w-full bg-teal-400 text-white font-bold py-2 px-4 rounded hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Senden
          </button>
        </form>
      )}
      <div className="flex justify-center mt-20 space-x-20">
        <div className="flex flex-col items-center">
          <a href="https://github.com/Pacome-Adoufack" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-6xl text-teal-400 hover:text-teal-600" />
          </a>
          <span className="text-lg text-teal-400 hover:text-teal-600">Pacome</span>
        </div>
        <div className="flex flex-col items-center">
          <a href="https://github.com/Okyanuspol" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-6xl text-teal-400 hover:text-teal-600" />
          </a>
          <span className="text-lg text-teal-400 hover:text-teal-600">Sükrü</span>
        </div>
        <div className="flex flex-col items-center">
          <a href="https://github.com/webdevbfb" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-6xl text-teal-400 hover:text-teal-600" />
          </a>
          <span className="text-lg text-teal-400 hover:text-teal-600">Bilal</span>
        </div>
        <div className="flex flex-col items-center">
          <a href="https://github.com/michkffm" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-6xl text-teal-400 hover:text-teal-600" />
          </a>
          <span className="text-lg text-teal-400 hover:text-teal-600">Michael</span>
        </div>
      </div>
    </div>
  );
}