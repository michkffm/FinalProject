import { Link } from "react-router-dom";
import strom from "../assets/STROM.jpeg";
import technology from "../assets/IT.jpeg";
import babysitting from "../assets/babysitting.jpeg";
import heizung from "../assets/heizung.jpeg";
import nachhilfe from "../assets/nachhilfe.jpeg";

export function HauptCategory() {
  return (
    <div className="sm:mt-12 mt-32 min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold text-teal-600 mb-8">Kategorien</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Strom */}
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500 transition-colors shadow-md"
        >
          <span className="font-semibold">Elektrik</span>
          <img
            src={strom}
            alt="strom"
            className="h-30 w-30 object-contain"
          />
        </Link>
  
        {/* Babysitting */}
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500 transition-colors shadow-md"
        >
          <span className="font-semibold">Babysitting</span>
          <img
            src={babysitting}
            alt="babysitting"
            className="h-30 w-30 object-contain"
          />
        </Link>
  
        {/* IT */}
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500 transition-colors shadow-md"
        >
          <span className="font-semibold">IT</span>
          <img
            src={technology}
            alt="technology"
            className="h-30 w-30 object-contain"
          />
        </Link>
  
        {/* Heizung */}
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500 transition-colors shadow-md"
        >
          <span className="font-semibold">Heizung</span>
          <img
            src={heizung}
            alt="heizung"
            className="h-30 w-30 object-contain"
          />
        </Link>
  
        {/* Nachhilfe */}
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500 transition-colors shadow-md"
        >
          <span className="font-semibold">Nachhilfe</span>
          <img
            src={nachhilfe}
            alt="nachhilfe"
            className="h-30 w-30 object-cover"
          />
        </Link>
      </div>
    </div>
  );
}