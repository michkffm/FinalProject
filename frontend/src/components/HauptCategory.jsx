import { Link } from "react-router-dom";
import strom from "../assets/STROM.jpeg";
import technology from "../assets/IT.jpeg";
import babysitting from "../assets/babysitting.jpeg";
import heizung from "../assets/heizung.jpeg";
import nachhilfe from "../assets/nachhilfe.jpeg";

export function HauptCategory() {
  return (
    <div className="flex flex-col items-center mt-40">
      <h1 className="text-3xl font-bold text-center mt-8 mb-4">Kategorien</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
          <span>Strom</span>
          <img src={strom} alt="strom" />
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>Babysitting</span>
            <img src={babysitting} alt="babysitting" />
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>IT</span>
            <img src={technology} alt="technology" />
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>Heizung</span>
            <img src={heizung} alt="heizung" />
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
             <span>Nachhilfe</span>
            <img src={nachhilfe} alt="nachhilfe" />
        </Link>
      </div>
    </div>
  );
}