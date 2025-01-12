import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function RatingsView() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const { jobId } = useParams();

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
        const totalRatings = data.reduce(
          (sum, rating) => sum + rating.rating,
          0
        );
        const average = data.length > 0 ? totalRatings / data.length : 0;
        setAverageRating(average);
      } catch (err) {
        setError(err.message || "Fehler beim Laden der Bewertungen.");
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

  const handleDelete = async (ratingId) => {
    try {
      const response = await fetch(`http://localhost:3000/ratings/${ratingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Nach erfolgreicher Löschung: State aktualisieren
      setRatings((prev) => prev.filter((rating) => rating._id !== ratingId));
      const remainingRatings = ratings.filter(
        (rating) => rating._id !== ratingId
      );
      const totalRatings = remainingRatings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      const average = remainingRatings.length > 0
        ? totalRatings / remainingRatings.length
        : 0;
      setAverageRating(average);
    } catch (err) {
      setError(err.message || "Fehler beim Löschen der Bewertung.");
    }
  };

  if (loading) return <p className="text-gray-500 text-center">Lädt...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="mt-12 mb-24 p-6 bg-gray-50 rounded-lg shadow-md">
      {ratings.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Durchschnittsbewertung:
            <span className="text-yellow-500 ml-2">
              {averageRating.toFixed(1)}
            </span>{" "}
            {renderStars(averageRating)}
          </h2>
          <ul className="space-y-4">
            {ratings.map((rating) => (
              <li
                key={rating._id}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center mb-2">
                  <strong className="text-gray-700 mr-2">
                    {rating.senderId.username}
                  </strong>
                  <span>{renderStars(rating.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm">{rating.content}</p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-500"
                    onClick={() => handleDelete(rating._id)}
                  >
                    Bewertung löschen
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          Keine Bewertungen verfügbar.
        </p>
      )}
    </div>
  );
}
