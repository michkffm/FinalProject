import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function PaymentMethods() {
  const [setMessage] = useState("");
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const price = urlParams.get("price");  // Preis aus der URL holen
  console.log("Preis:", price);
  console.log("API Key:", import.meta.env.VITE_PAYPAL_API_KEY);

  useEffect(() => {
    const section = document.querySelector('.handshake-section');
    setTimeout(() => {
      section.classList.add('visible');
    }, 100); // Verzögerung von 100ms
  }, []);
  
  
  return (
    <PayPalScriptProvider
    
      options={{
       
        "client-id":
        import.meta.env.VITE_PAYPAL_API_KEY, // Ersetze mit deiner Client-ID
        currency: "EUR", // Optional: Wähle die gewünschte Währung
      }}
    >
      <main className="zero-section flex flex-col items-center px-4 py-8 sm:gap-20 gap-0">
      <div className="handshake-section absolute inset-0 z-10"></div>
      <div className="bg-white bg-opacity-40 mt-80 sm:flex-row justify-between z-10 items-center border-2 border-teal-300 shadow-md rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Zahlungsmethoden</h1>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price, // Der Preis des Produkts
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
             setMessage(
                `Transaktion abgeschlossen von ${details.payer.name.given_name}`
              );
            });
          }}
          onError={(err) => {
            console.error("PayPal Fehler:", err);
          }}
        />
        </div>
      </main>
    </PayPalScriptProvider>
  );
}