import { useState } from "react";

export function Help() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqItems = [
    {
      title: "Allgemeine Fragen",
      items: [
        {
          question: "Wie registriere ich mich?",
          answer:
            "Klicken Sie oben rechts auf „Registrieren“ und füllen Sie das Formular aus. Eine Bestätigungs-E-Mail wird an Sie gesendet.",
        },
        {
          question: "Ist die Registrierung kostenlos?",
          answer: "Ja, die Registrierung ist vollkommen kostenlos.",
        },
        {
          question: "Welche Dienstleistungen bieten Sie an?",
          answer:
            "Wir bieten Dienstleistungen in den Bereichen Beratung, Reparatur, IT, Bau, Reinigung und mehr.",
        },
        {
          question: "Wie kann ich eine Dienstleistung buchen?",
          answer:
            "Wählen Sie eine Dienstleistung aus, klicken Sie auf „Buchen“ und folgen Sie den Anweisungen.",
        },
        {
          question: "Welche Zahlungsmethoden akzeptieren Sie?",
          answer:
            "Wir akzeptieren Kreditkarten, PayPal und SEPA-Überweisungen.",
        },
      ],
    },
    {
      title: "Benutzerkonto",
      items: [
        {
          question: "Wie ändere ich meine Kontodaten?",
          answer:
            "Gehen Sie zu „Mein Konto“, klicken Sie auf „Bearbeiten“ und speichern Sie die Änderungen.",
        },
        {
          question: "Was mache ich, wenn ich mein Passwort vergessen habe?",
          answer:
            "Klicken Sie auf „Passwort vergessen?“ auf der Login-Seite und folgen Sie den Anweisungen.",
        },
        {
          question: "Kann ich mein Konto löschen?",
          answer:
            "Ja, Sie können Ihr Konto in den Kontoeinstellungen dauerhaft löschen.",
        },
        {
          question:
            "Kann ich mein Konto wiederherstellen, wenn es gelöscht wurde?",
          answer:
            "Leider können gelöschte Konten nicht wiederhergestellt werden.",
        },
        {
          question: "Wie sicher sind meine Daten?",
          answer:
            "Ihre Daten werden nach höchsten Sicherheitsstandards geschützt und nicht an Dritte weitergegeben.",
        },
      ],
    },
    {
      title: "Dienstleistungen",
      items: [
        {
          question: "Wie finde ich die richtige Dienstleistung?",
          answer:
            "Nutzen Sie die Suchleiste oder durchsuchen Sie unsere Kategorien.",
        },
        {
          question: "Bieten Sie maßgeschneiderte Dienstleistungen an?",
          answer:
            "Ja, kontaktieren Sie uns mit Ihren speziellen Anforderungen, und wir finden eine Lösung.",
        },
        {
          question: "Kann ich den Anbieter meiner Dienstleistung auswählen?",
          answer:
            "Ja, Sie können aus verschiedenen Anbietern wählen, basierend auf Bewertungen und Profilinformationen.",
        },
        {
          question: "Wie lange dauert die Bearbeitung meiner Anfrage?",
          answer:
            "Normalerweise erhalten Sie innerhalb von 24 Stunden eine Antwort.",
        },
        {
          question:
            "Was passiert, wenn ich mit der Dienstleistung unzufrieden bin?",
          answer:
            "Kontaktieren Sie uns über den Support, und wir kümmern uns um eine Lösung oder Rückerstattung.",
        },
      ],
    },
    {
      title: "Zahlungen und Stornierungen",
      items: [
        {
          question: "Wie storniere ich eine Buchung?",
          answer:
            "Gehen Sie zu „Meine Buchungen“, wählen Sie die Buchung aus und klicken Sie auf „Stornieren“.",
        },
        {
          question: "Fallen Stornierungsgebühren an?",
          answer:
            "Es können Gebühren anfallen, abhängig von der Stornierungsrichtlinie der Dienstleistung.",
        },
        {
          question: "Erhalte ich eine Rechnung für meine Buchung?",
          answer:
            "Ja, eine Rechnung wird automatisch per E-Mail an Sie gesendet.",
        },
        {
          question: "Was passiert, wenn meine Zahlung fehlschlägt?",
          answer:
            "Überprüfen Sie Ihre Zahlungsmethode oder kontaktieren Sie den Support für Hilfe.",
        },
        {
          question: "Kann ich eine Anzahlung leisten?",
          answer:
            "Einige Dienstleistungen bieten die Möglichkeit, eine Anzahlung zu leisten. Details finden Sie in der Buchungsübersicht.",
        },
      ],
    },
  ];

  return (
    <div className="zero-section min-h-screen px-4 py-8 flex justify-center items-center">
      <div className="faq-container bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-4xl mt-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-teal-600">
          Häufige Fragen (FAQ)
        </h2>
        {faqItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="text-2xl font-semibold mb-6 text-teal-600">
              {section.title}
            </h3>
            <ul className="space-y-4">
              {section.items.map((item, index) => (
                <li key={index} className="border-b border-gray-300 pb-4">
                  <button
                    onClick={() => toggleQuestion(`${sectionIndex}-${index}`)}
                    className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  >
                    {item.question}
                    <span className="ml-2 text-teal-500">
                      {activeQuestion === `${sectionIndex}-${index}`
                        ? "-"
                        : "+"}
                    </span>
                  </button>
                  {activeQuestion === `${sectionIndex}-${index}` && (
                    <p className="mt-3 text-gray-700">{item.answer}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
