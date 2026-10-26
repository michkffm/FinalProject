import { Link } from "react-router-dom";
import { JobRatings } from "./JobRatings.jsx";

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
export function JobCard({ job, canDelete, onDelete, contactMessage, onContactChange, onContactSubmit, showRatings = false }) {
  return <article className="job-card" aria-labelledby={`job-${job._id}`}>
    <div className="job-card-heading"><span className="job-category">{job.category}</span>
      {canDelete && <button type="button" className="job-delete" aria-label={`Angebot „${job.title}“ löschen`} onClick={() => onDelete(job._id)}>Löschen</button>}
    </div>
    <h2 id={`job-${job._id}`}>{job.title}</h2>
    {job.createdBy?.username && <p className="job-author">Von {job.createdBy.username}</p>}
    <p className="job-description">{job.description}</p>
    <dl className="job-details"><div><dt>Standort</dt><dd>{job.location}</dd></div>
      <div><dt>Kontakt</dt><dd>{job.contact}</dd></div></dl>
    <p className="job-price">{euro.format(Number(job.price))}</p>
    <div className="job-actions"><Link to={`/ratings/${job._id}`}>Bewerten</Link><Link to={`/payment/${job._id}`}>Zahlungsinfo</Link></div>
    <form className="job-contact" onSubmit={e => onContactSubmit(e, job._id)}>
      <label htmlFor={`message-${job._id}`}>Nachricht zum Angebot</label>
      <textarea id={`message-${job._id}`} name="message" value={contactMessage || ""} onChange={e => onContactChange(e, job._id)} rows="3" required maxLength={5000} placeholder="Schreibe dem Anbieter …" />
      <button type="submit">Nachricht senden</button>
    </form>
    {showRatings && <JobRatings jobId={job._id} />}
  </article>;
}
