import React from "react";
import "../styles/Thumbnail.css";

const Thumbnail = ({ track, isActive, onClick, fetchAndSetAudioAnalysis }) => {
  const handleAnalysisClick = () => {
    fetchAndSetAudioAnalysis(track.id);
  };

  return (
    <div className={`thumbnail ${isActive ? "active" : ""}`} onClick={onClick}>
      <img
        src={track.image}
        alt={track.name}
        className="thumbnail-image"
        onClick={handleAnalysisClick}
      />
    </div>
  );
};

export default Thumbnail;
