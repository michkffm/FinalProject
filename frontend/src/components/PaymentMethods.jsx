import { useParams } from "react-router-dom";

export function PaymentMethods() {
  const { jobId } = useParams();

  const handlePayment = (method) => {
    alert(`Du hast ${method} für Job ${jobId} ausgewählt.`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Zahlungsmethoden auswählen</h1>
      <button
        onClick={() => handlePayment("Kreditkarte")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Kreditkarte
      </button>
      <button
        onClick={() => handlePayment("PayPal")}
        className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 hover:bg-yellow-600"
      >
        PayPal
      </button>
      <button
        onClick={() => handlePayment("Banküberweisung")}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        Banküberweisung
      </button>
    </div>
  );
}
