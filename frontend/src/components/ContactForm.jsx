import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

function ContactForm() {
  const [state, handleSubmit] = useForm("mzzblene");
  if (state.succeeded) {
    return <p>Danke für deine Nachricht!</p>;
  }
  return (
    <div className="mt-40"> {/* Fügt einen größeren oberen Rand hinzu */}
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
        <button type="submit" disabled={state.submitting} className="w-full bg-teal-400 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Senden
        </button>
      </form>
    </div>
  );
}

export default ContactForm;