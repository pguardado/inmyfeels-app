import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphComponent from "../components/GraphComponent";
import { fetchAudioAnalysis, fetchTrackDetails } from "../components/AuthUtils";
import "../styles/analysisPage.css";

const AnalysisPage = () => {
  const { trackId } = useParams();
  const [trackName, setTrackName] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("spotify_access_token");
      if (accessToken) {
        try {
          const [trackDetails, analysisData] = await Promise.all([
            fetchTrackDetails(accessToken, trackId),
            fetchAudioAnalysis(accessToken, trackId),
          ]);
          setTrackName(trackDetails.name);
          setAudioAnalysis(analysisData);
        } catch (error) {
          console.error("Error fetching data", error);
          setError(
            "Failed to fetch data. Please check your internet connection."
          );
        }
      } else {
        console.error("Access token not found in local storage");
        setError("Access token not found. Please authorize the application.");
      }
    };

    fetchData();
  }, [trackId]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!trackName || !audioAnalysis) {
    return <p>Loading...</p>;
  }

  const { sections, bars, beats } = audioAnalysis;

  return (
    <div className="analysis-page">
      <h1>Audio Analysis for {trackName}</h1>
      <div className="graph-container">
        <GraphComponent sections={sections} bars={bars} beats={beats} />{" "}
      </div>
    </div>
  );
};

export default AnalysisPage; // Exporting the AnalysisPage component
