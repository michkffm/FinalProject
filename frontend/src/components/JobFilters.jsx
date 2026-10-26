import { emptyJobFilters } from "../filterJobs.js";

export function JobFilters({ filters, onChange, onReset, categories, count, loading }) {
  const active = Object.entries(emptyJobFilters).some(([key, value]) => (filters[key] ?? value) !== value);
  return <section className="job-filters" aria-label="Angebote filtern">
    <div className="filter-heading"><h2>Angebote filtern</h2>
      <button type="button" onClick={onReset} disabled={!active}>Filter zurücksetzen</button>
    </div>
    <div className="filter-fields">
      <label>Suchbegriff<input type="search" name="name" value={filters.name} onChange={onChange} placeholder="z. B. Reparatur" /></label>
      {categories && <label>Kategorie<select name="category" value={filters.category} onChange={onChange}>
        <option value="">Alle Kategorien</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}
      </select></label>}
      <label>Standort<input type="search" name="location" value={filters.location} onChange={onChange} placeholder="Stadt oder Ort" /></label>
      <label>Preis<select name="price" value={filters.price} onChange={onChange}>
        <option value="all">Alle Preise</option><option value="low">Unter 50 €</option>
        <option value="medium">50 bis 100 €</option><option value="high">Über 100 €</option>
      </select></label>
      <label>Sortierung<select name="sort" value={filters.sort} onChange={onChange}>
        <option value="newest">Neueste Angebote zuerst</option>
        <option value="price-asc">Preis: niedrigster zuerst</option>
        <option value="price-desc">Preis: höchster zuerst</option>
      </select></label>
    </div>
    <p role="status">{loading ? "Angebote werden geladen …" : `${count} ${count === 1 ? "Angebot" : "Angebote"} gefunden`}</p>
  </section>;
}
