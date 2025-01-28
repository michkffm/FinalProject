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
import { useState } from "react";

export function HomeSlider() {
  const [isLoggedIn] = useState(localStorage.getItem("token") !== null);
  const [message, setMessage] = useState("");

  const handleUnauthorizedClick = (event) => {
    if (!isLoggedIn) {
      event.preventDefault();
      setMessage("Bitte logge dich ein, um fortzufahren.");
    }
  };
  return (
    <div className="slider-container">
      <div className="animate-slide-left">
        <Link
          to="/categorie/Beratung"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">Beratung</span>
          <img
            src={beratung}
            alt="beratung"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Bildung und Schulung"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">Bildung und Schulung</span>
          <img
            src={bildung}
            alt="bildung"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Betreuung und Gesundheit"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">
            Betreuung und Gesundheit
          </span>
          <img
            src={gesundheit}
            alt="gesundheit"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Finanzen und Versicherungen"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">
            Finanzen und Versicherungen
          </span>
          <img
            src={finance}
            alt="finance"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Technologie und IT"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">Technologie und IT</span>
          <img
            src={technologie}
            alt="technologie"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Reparatur und Wartung"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">Reparatur und Wartung</span>
          <img
            src={reparatur}
            alt="reparatur"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Transport und Logistik"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">Transport und Logistik</span>
          <img
            src={transport}
            alt="transport"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Reinigung und Pflege"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">Reinigung und Pflege</span>
          <img
            src={reinigung}
            alt="reinigung"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Bau- und Renovierungsdienste"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">
            Bau- und Renovierungsdienste
          </span>
          <img
            src={bau}
            alt="bau"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>

        <Link
          to="/categorie/Freizeit und Unterhaltung"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
          onClick={handleUnauthorizedClick}>
          <span className="text-lg font-semibold">
            Freizeit und Unterhaltung
          </span>
          <img
            src={freizeit}
            alt="freizeit"
            className="rounded-lg h-44 w-72 object-cover background-image"
          />
        </Link>
        <Link
          to="/categorie/Essen und Trinken"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
        >
          <span className="text-lg font-semibold">Essen und Trinken</span>
          <img
            src={essen}
            alt="essen und trinken"
            className="rounded-lg h-44 w-72 object-cover"
          />
        </Link>
        <Link
          to="/categorie/Sport und Lifestyle"
          className="slider-item flex flex-col items-center gap-4 bg-teal-600 bg-opacity-40 text-white p-6 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105"
        >
          <span className="text-lg font-semibold">Sport und Lifestyle</span>
          <img
            src={sport}
            alt="sport"
            className="rounded-lg h-44 w-72 object-cover"
          />
        </Link>
      </div>
    </div>
  );
}