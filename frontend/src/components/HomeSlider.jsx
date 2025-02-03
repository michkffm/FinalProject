import { Link } from "react-router-dom";
import { useState } from "react";
import beratung from "../assets/beratung.jpeg";
import bildung from "../assets/bildung.jpeg";
import betreuung from "../assets/gesundheit.jpeg";
import finance from "../assets/finance.jpeg";
import technologie from "../assets/technologie.jpeg";
import reparatur from "../assets/reparatur.jpeg";
import transport from "../assets/transport.jpeg";
import reinigung from "../assets/reinigung.jpeg";
import bau from "../assets/bau.jpeg";
import freizeit from "../assets/freizeit.jpeg";
import essen from "../assets/essen und trinken.jpeg";
import sport from "../assets/sport.jpeg";
import { useNavigate } from "react-router-dom";
const categories = [
  { name: "Beratung", image: beratung, link: "/categorie/Beratung" },
  {
    name: "Bildung und Schulung",
    image: bildung,
    link: "/categorie/Bildung und Schulung",
  },
  {
    name: "Betreuung und Gesundheit",
    image: betreuung,
    link: "/categorie/Betreuung und Gesundheit",
  },
  {
    name: "Finanzen und Versicherungen",
    image: finance,
    link: "/categorie/Finanzen und Versicherungen",
  },
  {
    name: "Technologie und IT",
    image: technologie,
    link: "/categorie/Technologie und IT",
  },
  {
    name: "Reparatur und Wartung",
    image: reparatur,
    link: "/categorie/Reparatur und Wartung",
  },
  {
    name: "Transport und Logistik",
    image: transport,
    link: "/categorie/Transport und Logistik",
  },
  {
    name: "Reinigung und Pflege",
    image: reinigung,
    link: "/categorie/Reinigung und Pflege",
  },
  {
    name: "Bau- und Renovierungsdienste",
    image: bau,
    link: "/categorie/Bau- und Renovierungsdienste",
  },
  {
    name: "Freizeit und Unterhaltung",
    image: freizeit,
    link: "/categorie/Freizeit und Unterhaltung",
  },
  {
    name: "Essen und Trinken",
    image: essen,
    link: "/categorie/Essen und Trinken",
  },
  {
    name: "Sport und Lifestyle",
    image: sport,
    link: "/categorie/Sport und Lifestyle",
  },
];
export function HomeSlider({ isLoggedIn }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage < categories.length
        ? prevIndex + itemsPerPage
        : 0
    );
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage >= 0
        ? prevIndex - itemsPerPage
        : categories.length - itemsPerPage
    );
  };
  const visibleCategories = categories.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );
  const handleSliderClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("Bitte logge dich ein, um Kategorie zu suchen.");
      setTimeout(() => {
        setMessage(""); // Nachricht nach 3 Sekunden ausblenden
        navigate("/login");
      }, 3000);
      return;
    }
    navigate();
  };
  return (
    <div className="relative w-full flex justify-center items-center overflow-hidden">
  <button
    onClick={handlePrev}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-teal-600 text-white rounded-full shadow-md hover:bg-teal-500 transition"
  >
    &lt;
  </button>
  <div className="flex justify-center items-center gap-4 overflow-hidden w-[90%]">
    {visibleCategories.map((category, index) =>
      isLoggedIn ? (
        <Link
          key={index}
          to={category.link}
          className="flex flex-col justify-between items-center bg-teal-600 bg-opacity-40 text-white p-4 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 transform hover:scale-105
                    flex-shrink-0 w-[22%] min-w-[180px] max-w-[250px] aspect-[3/4] min-h-[250px]"
        >
          {/* Yazı Alanı */}
          <span className="text-sm font-semibold text-center min-h-[50px] flex items-center justify-center break-words px-2">
            {category.name}
          </span>
          {/* Resim Alanı */}
          <div className="w-full flex-grow flex items-end">
            <img
              src={category.image}
              alt={category.name}
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
        </Link>
      ) : (
        <div
          key={index}
          onClick={handleSliderClick}
          className="flex flex-col justify-between items-center bg-teal-600 bg-opacity-40 text-white p-4 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 transform hover:scale-105
                    flex-shrink-0 w-[22%] min-w-[180px] max-w-[250px] aspect-[3/4] min-h-[250px]"
        >
          {/* Yazı Alanı */}
          <span className="text-sm font-semibold text-center min-h-[50px] flex items-center justify-center break-words px-2">
            {category.name}
          </span>
          {/* Resim Alanı */}
          <div className="w-full flex-grow flex items-end">
            <img
              src={category.image}
              alt={category.name}
              className="rounded-lg w-full h-full object-cover opacity-50"
            />
          </div>
        </div>
      )
    )}
  </div>
  <button
    onClick={handleNext}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-teal-600 text-white rounded-full shadow-md hover:bg-teal-500 transition"
  >
    &gt;
  </button>
</div>
  );
}