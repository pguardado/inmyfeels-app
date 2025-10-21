import React from "react";
import { Link } from "react-router-dom";
const Card = ({ track, index }) => {
  let artists = Array.isArray(track.artists)
    ? track.artists.join(", ")
    : track.artists;

  return (
    <div className="card">
      <div className="card-header">
        <span className="ranking-number">#{index}</span>{" "}
      </div>
      <div className="card-image">
        {track.image && (
          <img src={track.image} alt={track.name} className="card-image" />
        )}
      </div>
      <div className="card-details">
        <h3 className="card-title">{track.name}</h3>{" "}
        <p className="card-artists">Artists: {artists}</p>{" "}
        <p className="card-popularity">Rank: {index}</p>{" "}
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="card-album-link"
        >
          Link to Album
        </a>
        <Link to={`/analysis/${track.id}`} className="analysis-button">
          {" "}
          Analysis
        </Link>
      </div>
    </div>
  );
};

export default Card; // Exporting the Card component as the default export
