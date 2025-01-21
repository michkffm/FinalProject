import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export function PaymentMethods() {
  const [setMessage] = useState("");
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const price = urlParams.get("price");  // Preis aus der URL holen
  console.log("Preis:", price);
  console.log("API Key:", import.meta.env.VITE_PAYPAL_API_KEY);
  
  
  return (
    <PayPalScriptProvider
    
      options={{
       
        "client-id":
        import.meta.env.VITE_PAYPAL_API_KEY, // Ersetze mit deiner Client-ID
        currency: "EUR", // Optional: Wähle die gewünschte Währung
      }}
    >
      <div className="App mt-48 mb-96">
        <h1>Zahlungsmethoden</h1>
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
    </PayPalScriptProvider>
  );
}
