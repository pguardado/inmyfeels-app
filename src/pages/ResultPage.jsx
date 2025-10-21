import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../context";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../components/Card";
import Thumbnail from "../components/Thumbnail";
import "../styles/resultPage.css";
import "../styles/boxPlot.css";
import "../styles/Thumbnail.css";
import PlotComponent from "../components/PlotComponent.jsx";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { getAccessToken } from "../components/AuthUtils";

const ResultPage = () => {
  const { error, tracks, handleSearch, audioFeatures } =
    useContext(SearchContext);
  const [accessTokenError, setAccessTokenError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  const location = useLocation();
  const locationSearchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = getAccessToken();
        console.log("Access Token from local storage:", accessToken);

        if (!accessToken) {
          throw new Error(
            "Access token not found in local storage. Please authorize the application."
          );
        }

        const genre = locationSearchParams.get("genre");
        const startYear = locationSearchParams.get("startYear");
        const endYear = locationSearchParams.get("endYear");

        if (!genre || !startYear || !endYear) {
          throw new Error(
            "Genre, start year, or end year not provided in search parameters."
          );
        }

        await handleSearch(genre, startYear, endYear);
        setLoading(false); // Set loading to false after successful fetch
      } catch (error) {
        console.error("Error fetching data:", error);
        setAccessTokenError(true);
        setLoading(false); // Set loading to false on error
      }
    };

    if (locationSearchParams.toString()) {
      fetchData();
    }
  }, [locationSearchParams, handleSearch]);

  const handleSlideChange = (current) => {
    setCurrentSlide(current);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    swipeToSlide: true,
    focusOnSelect: true,
    afterChange: handleSlideChange,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const renderCarousel = () => (
    <Slider ref={sliderRef} {...settings}>
      {tracks.map((track, index) => (
        <div key={track.id} className="carousel-item">
          <Card track={track} index={index + 1} />
        </div>
      ))}
    </Slider>
  );

  const renderThumbnails = () => {
    const visibleThumbnails = tracks.slice(currentSlide, currentSlide + 4);

    return (
      <div className="carousel-thumbnails">
        {visibleThumbnails.map((track, index) => (
          <Thumbnail
            key={track.id}
            track={track}
            isActive={index === currentSlide % 4}
            onClick={() => sliderRef.current.slickGoTo(currentSlide + index)}
            className="thumbnail"
          />
        ))}
      </div>
    );
  };

  const featureDescriptions = {
    danceability:
      "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.",
    energy:
      "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity.",
    loudness:
      "The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track.",
    speechiness:
      "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording, the closer to 1.0 the attribute value.",
    acousticness:
      "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
    instrumentalness:
      "Predicts whether a track contains no vocals. The closer the value is to 1.0, the greater likelihood the track contains no vocal content.",
    liveness:
      "Detects the presence of an audience in the recording. Higher values represent an increased probability that the track was performed live.",
    valence:
      "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track.",
    tempo: "The overall estimated tempo of a track in beats per minute (BPM).",
  };

  const renderBoxPlots = useMemo(() => {
    if (loading) return <p>Loading...</p>; // Show loading indicator while fetching data
    if (!audioFeatures) return null;

    const yAxesRanges = {
      danceability: [0, 1],
      energy: [0, 1],
      loudness: [-60, 0],
      speechiness: [0, 1],
      acousticness: [0, 1],
      instrumentalness: [0, 1],
      liveness: [0, 1],
      valence: [0, 1],
      tempo: [0, 250],
    };

    const colors = [
      "rgba(93, 164, 214, 0.5)",
      "rgba(255, 144, 14, 0.5)",
      "rgba(44, 160, 101, 0.5)",
      "rgba(255, 65, 54, 0.5)",
      "rgba(207, 114, 255, 0.5)",
      "rgba(127, 96, 0, 0.5)",
      "rgba(255, 140, 184, 0.5)",
      "rgba(79, 90, 117, 0.5)",
      "rgba(222, 223, 0, 0.5)",
      "rgba(150, 123, 182, 0.5)",
      "rgba(255, 195, 0, 0.5)",
    ];

    // Get keys of audioFeatures object
    const features = Object.keys(audioFeatures);

    // Map each feature to a plot component
    const plots = features.map((feature, index) => {
      const data = [
        {
          y: audioFeatures[feature], // Data for the y-axis
          type: "box", // Type of plot
          name: feature, // Name of the feature
          boxpoints: "all", // Display all points
          jitter: 0.5, // Jitter amount
          whiskerwidth: 0.2, // Whisker width
          fillcolor: colors[index % colors.length], // Fill color
          marker: {
            size: 3, // Marker size
            color: colors[index % colors.length], // Marker color
          },
          line: {
            width: 1, // Line width
          },
        },
      ];

      // Layout for the plot
      const layout = {
        title: {
          text: `${feature} Distribution`, // Title text
          y: 0.9, // Vertical position of title
          x: 0.5, // Horizontal centering of title
          xanchor: "center", // Anchor point for x-axis
          yanchor: "top", // Anchor point for y-axis
          font: { size: 14 }, // Font size for title
        },
        yaxis: {
          title: {
            text: feature, // Y-axis label text
            standoff: 20, // Space between label and tick labels
            font: { size: 12 }, // Font size for y-axis label
          },
          range: yAxesRanges[feature], // Y-axis range
          gridcolor: "rgb(255, 255, 255)", // Grid color
          gridwidth: 1, // Grid width
          zerolinecolor: "rgb(255, 255, 255)", // Zero line color
          zerolinewidth: 2, // Zero line width
          tickfont: { size: 10 }, // Tick label font size
        },
        margin: {
          l: 60, // Left margin
          r: 20, // Right margin
          b: 40, // Bottom margin
          t: 60, // Top margin
          pad: 4, // Padding
        },
        height: 250, // Height of the plot
        width: 350, // Width of the plot
        paper_bgcolor: "rgb(243, 243, 243)", // Background color for paper
        plot_bgcolor: "rgb(243, 243, 243)", // Background color for plot
        showlegend: false, //
      };

      return (
        <div key={feature} className="plot-container">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${feature}`}>
                {featureDescriptions[feature]}
              </Tooltip>
            }
          >
            <div className="plot">
              <PlotComponent data={data} layout={layout} />
            </div>
          </OverlayTrigger>
        </div>
      );
    });

    return <div className="plots-container">{plots}</div>;
  }, [loading, audioFeatures]);

  return (
    <div className="result-page">
      {error && <p>{error}</p>}
      {accessTokenError && (
        <p>
          Access token not found. Please authorize the application and try
          again.
        </p>
      )}
      {!accessTokenError && (
        <>
          <h2>Search Results</h2>
          <div className="carousel-container">
            {renderCarousel()}
            {renderThumbnails()}
          </div>
          <h2>Audio Feature Distributions</h2>
          {renderBoxPlots}
        </>
      )}
    </div>
  );
};

const NextArrow = ({ onClick }) => (
  <div className="slick-next" onClick={onClick}>
    →
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="slick-prev" onClick={onClick}>
    ←
  </div>
);

export default ResultPage;
