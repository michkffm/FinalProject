import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { useNavigate } from "react-router-dom";

export function Ratings() {
  const { jobId } = useParams();
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const navigate = useNavigate();

  if (!jobId) {
    return <p>Job-ID fehlt. Bitte überprüfen Sie die URL.</p>;
  }

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleCommentChange = (e) => {
    setUserComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userRating || !userComment) {
      setMessage("Alle Felder sind erforderlich.");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Bitte einloggen.");
      setIsSubmitting(false);
      return;
    }

    setIsFormSubmitted(true);
  };

  useEffect(() => {
    if (isFormSubmitted) {
      const token = localStorage.getItem("token");

      fetch("http://localhost:3000/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: jobId,
          rating: userRating,
          content: userComment,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessage("Bewertung erfolgreich hinzugefügt!");
          setUserRating(0);
          setUserComment("");
          setTimeout(() => {
            navigate("/hauptCategorie");
          }, 2000);
        })
        .catch(() => {
          setMessage("Fehler beim Hinzufügen der Bewertung.");
        })
        .finally(() => {
          setIsSubmitting(false);
          setIsFormSubmitted(false);
        });
    }
  }, [isFormSubmitted, jobId, userRating, userComment]);

  return (
    <main className="position zero-section min-h-screen bg-gray-50 px-4 py-8 flex justify-center items-center">
    <div className="flex flex-col justify-between items-center bg-white bg-opacity-40 border-2 border-teal-300 rounded-lg shadow-md p-6 max-w-xl w-full">
    {message && (
      <p
        className={`mt-4 text-center font-medium ${
          message.includes("erfolgreich") ? "text-green-600" : "text-red-600"
        }`}
      >
        {message}
      </p>
    )}
    <h2 className="text-2xl font-bold text-gray-800 mb-4 ">
      Bewertung hinzufügen
    </h2>
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="flex flex-col items-center">
        <StarRatings
          rating={userRating}
          changeRating={handleRatingChange}
          starDimension="40px"
          starSpacing="8px"
          starRatedColor="#FFD700"
          starEmptyColor="#E5E7EB"
        />
        <p className="text-sm text-gray-600 mt-2">
          Wählen Sie eine Bewertung aus.
        </p>
      </div>
      <textarea
        value={userComment}
        onChange={handleCommentChange}
        placeholder="Schreiben Sie einen Kommentar..."
        rows="4"
        className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
      ></textarea>
      <button
        type="submit"
        className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Senden..." : "Senden"}
      </button>
    </form>
  </div>
  </main>
  );
}
