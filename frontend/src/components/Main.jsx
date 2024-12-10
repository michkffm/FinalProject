export function Main() {
  return (
    <main className="p-4">
      <section className="max-w-4xl mx-auto mt-10 border-2 p-4 h-auto text-center pt-8">
        <h1 className="text-2xl font-bold">
          Finden Sie qualifizierte Fachleute für Ihre Aufgaben
        </h1>
        <p className="text-gray-600 mt-2">
          Verbindung zu qualifizierten Dienstleistern für alle Ihre Bedürfnisser
        </p>
        <form className="flex gap-4 ml-64 pt-8">
          <input
            id="search-input"
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="text"
            placeholder="suche nach Dienstleistung"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          >
            Suchen
          </button>
        </form>
      </section>
      <section className="flex mt-20">
        <div className="w-92 border-2 rounded-lg h-92 pr-8 mr-4 p-8 ml-72  ">
          <h2 className="text-xl font-semibold mb-4">
            Finden nach Dienstleister
          </h2>
          <form className="space-y-4">
            <div>
              <label>Stadt</label>
              <input
                id="stadt-input"
                type="text"
                placeholder="Frankfurt"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label>Entfernung (in km)</label>
              <input
                id="kilometer-slider"
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                Aktuelle Auswahl: <span id="kilometer-value">50</span> km
              </div>
            </div>
            <div>
              <label>Was brauchst du?</label>
              <input
                id="dienst-input"
                type="text"
                placeholder="Fliesenleger"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 ml-36"
            >
              Suchen
            </button>
          </form>
        </div>

        <div className="w-92 border-2 rounded-lg h-92 pr-8 mr-4 p-8 ml-72">
          <h2 className="text-xl font-semibold mb-4">
            Bieten nach Dienstleister
          </h2>
          <form className="space-y-4">
            <div>
              <label>Stadt</label>
              <input
                id="stadt-input"
                type="text"
                placeholder="Frankfurt"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label>Entfernung (in km)</label>
              <input
                id="kilometer-slider"
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                Aktuelle Auswahl: <span id="kilometer-value">50</span> km
              </div>
            </div>
            <div>
              <label>Was bietest du an?</label>
              <input
                id="dienst-input"
                type="text"
                placeholder="Fliesenleger"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 ml-36"
            >
              Suchen
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
