import { useState, useEffect } from "react";

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

  const displayedRatings = showAll ? ratings : ratings.slice(0, 1);
   
  return (
    <div>
      {ratings.length > 0 ? (
        <div>
          <p>
            Durchschnittsbewertung: {averageRating.toFixed(1)}{" "}
            {renderStars(averageRating)}
          </p>
          <ul>
            {displayedRatings.map((rating) => (
              <li key={rating._id}>
                <strong>{rating.senderId.username}</strong>:{" "}
                {renderStars(rating.rating)}
                <p>{rating.content}</p>
              </li>
            ))}
          </ul>
          {!showAll && ratings.length > 2 && (
            <button className="w-6/12 bg-blue-500 text-white py-2 rounded hover:bg-teal-600 transition-colors mt-2" onClick={handleLoadMore}>
                Mehr laden...
            </button>
          )}
        </div>
      ) : (
        <p>Keine Bewertungen für diesen Job verfügbar.</p>
      )}
    </div>
  );
}
