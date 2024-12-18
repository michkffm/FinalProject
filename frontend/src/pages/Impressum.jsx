export default function Impressum() {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:py-24 bg-gray-50">
    <div className="sm:mt-0 mt-28 border border-gray-200 rounded-lg shadow-lg bg-white w-full max-w-4xl p-6 sm:p-12">
      <h1 className="text-3xl font-bold mb-6">Impressum</h1>

      <h2 className="text-xl font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
      <p>
        <strong>Unternehmensname:</strong> EasyHelfer INC
        <br />
        <strong>Vertreten durch:</strong> Michael Cebeci
      </p>

      <div className="mt-4">
        <p>
          <strong>Adresse:</strong>
          <br />
          Musterstraße 1<br />
          12345 Musterstadt
        </p>
      </div>

      <div className="mt-4">
        <p>
          <strong>Kontakt:</strong>
          <br />
          Telefon: +49 (0) 123 456 789
          <br />
          E-Mail: info@beispiel.de
        </p>
      </div>

      <div className="mt-4">
        <p>
          <strong>Registereintrag:</strong>
          <br />
          Eintragung im Handelsregister
          <br />
          Registergericht: Amtsgericht Musterstadt
          <br />
          Registernummer: HRB 12345
        </p>
      </div>

      <div className="mt-4">
        <p>
          <strong>Umsatzsteuer-ID:</strong>
          <br />
          Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:
          <br />
          DE123456789
        </p>
      </div>

      <div className="mt-4">
        <p>
          <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong>
          <br />
          Max Mustermann
          <br />
          Musterstraße 1
          <br />
          12345 Musterstadt
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Haftungsausschluss (Disclaimer)</h2>

      <h3 className="text-lg font-medium mb-2">Haftung für Inhalte</h3>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
        allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch
        nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
        Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
      </p>
      <p className="mt-2">
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
        Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
        der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
        Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-2">Haftung für Links</h3>
      <p>
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss
        haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
        der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
        Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
      </p>
      <p className="mt-2">
        Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
        Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen
        werden wir derartige Links umgehend entfernen.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-2">Urheberrecht</h3>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
        deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
        Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
        jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten,
        nicht kommerziellen Gebrauch gestattet.
      </p>
      <p className="mt-2">
        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
        Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
        Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
        entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte
        umgehend entfernen.
      </p>
    </div>
    </div>
  );
}
