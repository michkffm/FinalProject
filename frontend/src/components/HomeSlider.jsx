import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [hoverDirection, setHoverDirection] = useState(null);
  const maxIndex = categories.length - itemsPerPage;
  const move = (direction) => {
    setCurrentIndex(index => direction === "next"
      ? (index >= maxIndex ? 0 : index + 1)
      : (index <= 0 ? maxIndex : index - 1));
  };
  useEffect(() => {
    if (!hoverDirection) return;
    const timer = setInterval(() => {
      setCurrentIndex(index => hoverDirection === "next"
        ? (index >= maxIndex ? 0 : index + 1)
        : (index <= 0 ? maxIndex : index - 1));
    }, 800);
    const stopWhenHidden = () => {
      if (document.hidden) setHoverDirection(null);
    };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", stopWhenHidden);
    };
  }, [hoverDirection, maxIndex]);
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
  };
  return (
    <section className="home-carousel" aria-label="Dienstleistungskategorien">
      {message && <p role="status">{message}</p>}
      <button type="button" className="carousel-arrow carousel-prev"
        aria-label="Vorherige Kategorien" onClick={() => move("prev")}
        onPointerEnter={e => { if (e.pointerType === "mouse") setHoverDirection("prev"); }}
        onPointerLeave={() => setHoverDirection(null)} onBlur={() => setHoverDirection(null)}>
        <span aria-hidden="true">‹</span>
      </button>
      <div className="carousel-window">
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 25}%)` }}>
          {categories.map((category, index) => {
            const content = <>
              <img src={category.image} alt="" loading="lazy" />
              <span>{category.name}</span>
            </>;
            const visible = index >= currentIndex && index < currentIndex + itemsPerPage;
            return <div className="carousel-item" key={category.name}>
              {isLoggedIn ? <Link to={category.link} className="category-tile" tabIndex={visible ? 0 : -1} aria-hidden={!visible}>{content}</Link>
                : <button type="button" className="category-tile" onClick={handleSliderClick} tabIndex={visible ? 0 : -1} aria-hidden={!visible}>{content}</button>}
            </div>;
          })}
        </div>
      </div>
      <button type="button" className="carousel-arrow carousel-next"
        aria-label="Nächste Kategorien" onClick={() => move("next")}
        onPointerEnter={e => { if (e.pointerType === "mouse") setHoverDirection("next"); }}
        onPointerLeave={() => setHoverDirection(null)} onBlur={() => setHoverDirection(null)}>
        <span aria-hidden="true">›</span>
      </button>
    </section>
  );
}
