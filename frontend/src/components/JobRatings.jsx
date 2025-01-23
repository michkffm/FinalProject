import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function JobRatings({ jobId }) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/ratings/${jobId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setRatings(data);

        // Durchschnittsbewertung berechnen
        const totalRatings = data.reduce((sum, rating) => sum + rating.rating, 0);
        const average = data.length > 0 ? totalRatings / data.length : 0;
        setAverageRating(average);
      } catch (err) {
        try {
          const parsedError = JSON.parse(err.message);
          setError(parsedError.error || "Unbekannter Fehler.");
        } catch {
          setError("Fehler beim Laden der Bewertungen.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [jobId, token]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <span style={{ color: "#FFD700", display: "inline-block" }}>
        {"★".repeat(fullStars)}
        {halfStar === 1 && "½"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  const handleLoadMore = () => {
    setShowAll(true);
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>{error}</p>;
   
  return (
    <div>
      {ratings.length > 0 ? (
        <div>
          <p>
            Bewertung: {averageRating.toFixed(1)}{" "}
            {renderStars(averageRating)}
          </p>
            <button className="text-teal-300 rounded duration-300 hover:text-teal-500 transition-colors" onClick={handleLoadMore}>
              <Link to={`/ratingsView/${jobId}`}> Mehr laden...</Link>
            </button>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}
