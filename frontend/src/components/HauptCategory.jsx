import { Link } from "react-router-dom";
import beratung from "../assets/beratung.jpeg";
import bildung from "../assets/bildung.jpeg";
import gesundheit from "../assets/gesundheit.jpeg";
import finance from "../assets/finance.jpeg";
import technologie from "../assets/technologie.jpeg";
import reparatur from "../assets/reparatur.jpeg";
import transport from "../assets/transport.jpeg";
import reinigung from "../assets/reinigung.jpeg";
import bau from "../assets/bau.jpeg";
import freizeit from "../assets/freizeit.jpeg";
import essen from "../assets/essen und trinken.jpeg";
import sport from "../assets/sport.jpeg";

const categories = [
  { name: "Beratung", image: beratung, path: "/categorie/Beratung" },
  { name: "Bildung und Schulung", image: bildung, path: "/categorie/Bildung und Schulung" },
  { name: "Betreuung und Gesundheit", image: gesundheit, path: "/categorie/Betreuung und Gesundheit" },
  { name: "Finanzen und Versicherungen", image: finance, path: "/categorie/Finanzen und Versicherungen" },
  { name: "Technologie und IT", image: technologie, path: "/categorie/Technologie und IT" },
  { name: "Reparatur und Wartung", image: reparatur, path: "/categorie/Reparatur und Wartung" },
  { name: "Transport und Logistik", image: transport, path: "/categorie/Transport und Logistik" },
  { name: "Reinigung und Pflege", image: reinigung, path: "/categorie/Reinigung und Pflege" },
  { name: "Bau- und Renovierungsdienste", image: bau, path: "/categorie/Bau- und Renovierungsdienste" },
  { name: "Freizeit und Unterhaltung", image: freizeit, path: "/categorie/Freizeit und Unterhaltung" },
  { name: "Essen und Trinken", image: essen, path: "/categorie/Essen und Trinken" },
  { name: "Sport und Lifestyle", image: sport, path: "/categorie/Sport und Lifestyle" },
];

export function HauptCategory() {
  return (
    <div className="zero-section min-h-screen sm:mt-0 mt-10 bg-gray-50 px-4 py-8">
      <div className="flex justify-center">
        <Link to="/jobs">
          <button className="bg-teal-600 text-white bg-opacity-40 p-4 sm:mt-14 mt-4 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105">
            Dienstleistung hinzufügen
          </button>
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl m-10 font-bold text-center text-teal-800">
          Bitte wähle eine Kategorie
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
            >
              <span className="text-lg font-semibold">{category.name}</span>
              <img
                src={category.image}
                alt={category.name}
                className="rounded-lg h-44 w-72 object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}