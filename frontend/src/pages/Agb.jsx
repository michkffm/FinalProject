export function TermsAndConditions() {
  return (
    <div className="flex justify-center items-center flex-col zero-section min-h-screen px-4 py-8">
      <div className="mt-14 bg-white bg-opacity-40 border-2 border-teal-300 rounded-lg shadow-lg bg-white w-full max-w-4xl p-6 sm:p-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8 text-teal-600">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        {/* Paragraph Container */}
        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Einleitung */}
          <p className="text-lg text-center">
            Willkommen bei <strong className="text-teal-500">EasyHelfer INC</strong>! Diese Allgemeinen Geschäftsbedingungen ("AGB") regeln die Nutzung unserer Website und Dienstleistungen. Bitte lesen Sie diese sorgfältig durch.
          </p>

          {/* Geltungsbereich */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">1. Geltungsbereich</h2>
            <p>
              Diese AGB gelten für alle Verträge, die zwischen uns und unseren Kunden über unsere Website abgeschlossen werden.
            </p>
          </section>

          {/* Vertragsschluss */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">2. Vertragsschluss</h2>
            <p>
              Der Vertrag kommt zustande, indem der Kunde unsere Dienstleistungen in Anspruch nimmt und die entsprechenden Bedingungen akzeptiert.
            </p>
          </section>

          {/* Preise und Zahlung */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">3. Preise und Zahlung</h2>
            <p>
              Die Preise für unsere Dienstleistungen sind auf unserer Website angegeben. Die Zahlung erfolgt gemäß den auf der Website angegebenen Zahlungsmethoden.
            </p>
          </section>

          {/* Haftung */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">4. Haftung</h2>
            <p>
              Wir haften nur für Schäden, die durch vorsätzliches oder grob fahrlässiges Verhalten verursacht wurden. Unsere Haftung ist auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
            </p>
          </section>

          {/* Datenschutz */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">5. Datenschutz</h2>
            <p>
              Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Unsere Datenschutzrichtlinie finden Sie auf unserer Website.
            </p>
          </section>

          {/* Schlussbestimmungen */}
          <section>
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">6. Schlussbestimmungen</h2>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
            <p>
              Diese AGB unterliegen dem Recht der Bundesrepublik Deutschland.
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
