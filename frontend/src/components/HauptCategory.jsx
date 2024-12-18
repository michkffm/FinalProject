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


export function HauptCategory() {
  return (
    <div className="flex flex-col items-center mt-40 mb-40">
      <h1 className="text-3xl font-bold text-center mt-8 mb-4">Bitte wähle eine Kategorie aus!!!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
          <span>Beratung</span>
          <img src={beratung} alt="beratung" className="rounded-lg"/>
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>Bildung und Schulung</span>
            <img src={bildung} alt="bildung"className="rounded-lg" />
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>Betreuung und Gesundheit</span>
            <img src={gesundheit} alt="gesundheit" className="rounded-lg" />
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>Finanzen und Versicherungen</span>
            <img src={finance} alt="finance" className="rounded-lg"/>
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
             <span>Technologie und IT</span>
            <img src={technologie} alt="technologie"className="rounded-lg" />
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
          <span>Reparatur und Wartung</span>
          <img src={reparatur} alt="reparatur"className="rounded-lg" />
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>Transport und Logistik</span>
            <img src={transport} alt="transport" className="rounded-lg"/>
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>Reinigung und Pflege</span>
            <img src={reinigung} alt="reinigung" className="rounded-lg"/>
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
            <span>Bau- und Renovierungsdienste</span>
            <img src={bau} alt="bau" className="rounded-lg"/>
        </Link>
        <Link
          to="/categorie"
          className="flex flex-col items-center gap-2 bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-500">
             <span>Freizeit und Unterhaltung</span>
            <img src={freizeit} alt="freizeit " className="rounded-lg"/>
        </Link>
      </div>
    </div>
  );
}