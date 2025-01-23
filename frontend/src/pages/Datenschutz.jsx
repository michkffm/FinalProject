import React from "react";

export function Datenschutz() {
  return (
    <div className="flex justify-center items-center flex-col zero-section min-h-screen px-4 py-8">
      <div className="mt-14 bg-white bg-opacity-40 border-2 border-teal-300 rounded-lg shadow-lg bg-white w-full max-w-4xl p-6 sm:p-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8 text-teal-600">
          Datenschutzerklärung
        </h1>

        {/* Paragraph Container */}
        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Verantwortlicher */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">1. Verantwortlicher</h2>
            <p>
              Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:<br />
              <strong>EasyHelper Inc</strong><br />
              Deine Adresse<br />
              Deine Stadt, PLZ<br />
              E-Mail: <a href="mailto:info@easyhelper.de" className="text-teal-500 underline">info@easyhelfer.de</a>
            </p>
          </section>

          {/* Erhebung und Speicherung personenbezogener Daten */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren Verwendung</h2>
            <h3 className="font-semibold text-teal-500 mb-2">a) Beim Besuch der Website</h3>
            <p>
              Beim Aufrufen unserer Website werden durch den Browser automatisch Informationen an den Server gesendet und temporär in einem Logfile gespeichert:
            </p>
            <ul className="list-disc pl-5">
              <li>IP-Adresse des anfragenden Rechners</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Name und URL der abgerufenen Datei</li>
              <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
              <li>Verwendeter Browser und Betriebssystem</li>
            </ul>
            <p>Diese Daten werden verarbeitet, um:</p>
            <ul className="list-disc pl-5">
              <li>einen reibungslosen Verbindungsaufbau zu gewährleisten,</li>
              <li>die Nutzung der Website zu verbessern,</li>
              <li>Systemstabilität zu analysieren und</li>
              <li>administrative Zwecke zu erfüllen.</li>
            </ul>
          </section>

          {/* Kontaktformular */}
          <section>
            <h3 className="font-semibold text-teal-500 mb-2">b) Bei Nutzung unseres Kontaktformulars</h3>
            <p>
              Für Fragen bieten wir ein Kontaktformular an. Die Angabe einer E-Mail-Adresse ist notwendig. Die Verarbeitung erfolgt auf Grundlage deiner Einwilligung gemäß Art. 6 Abs. 1 S. 1 lit. a DSGVO.
            </p>
          </section>

          {/* Weitergabe von Daten */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">3. Weitergabe von Daten</h2>
            <p>
              Eine Weitergabe deiner persönlichen Daten erfolgt nur, wenn:
            </p>
            <ul className="list-disc pl-5">
              <li>du eine ausdrückliche Einwilligung erteilst,</li>
              <li>es gesetzlich vorgeschrieben ist,</li>
              <li>die Weitergabe zur Vertragsabwicklung erforderlich ist.</li>
            </ul>
          </section>

          {/* Betroffenenrechte */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">4. Betroffenenrechte</h2>
            <p>
              Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie das Recht, eine Beschwerde einzulegen (Art. 15–21 DSGVO).
            </p>
          </section>

          {/* Datensicherheit */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">5. Datensicherheit</h2>
            <p>
              Wir verwenden SSL-Verschlüsselung, um die Sicherheit deiner Daten während der Übertragung zu gewährleisten.
            </p>
          </section>

          {/* Aktualität */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">6. Aktualität und Änderungen</h2>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig (Stand: Dezember 2024) und kann bei Bedarf angepasst werden.
            </p>
          </section>
        </div>

        {/* Abschluss */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Vielen Dank für Ihr Vertrauen in <span className="text-teal-500 font-semibold">EasyHelfer INC</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
