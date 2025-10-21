import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  fetchGenreSeeds,
  fetchGenreDate,
  getAccessToken,
  fetchAudioFeatures,
  fetchAudioAnalysis, // Make sure to import fetchAudioAnalysis
} from "./components/AuthUtils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Thumbnail from "./components/Thumbnail";
import debounce from "lodash/debounce";

const SearchContext = createContext();

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

const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genreSeeds, setGenreSeeds] = useState([]);
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false); // Track fetch completion
  const sliderRef = useRef(null);
  const prevSearchParams = useRef(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("Access token not found in local storage");
        setError("Access token not found. Please authorize the application.");
        return;
      }

      try {
        const seeds = await fetchGenreSeeds(accessToken);
        setGenreSeeds(seeds);

        const genre = searchParams.get("genre");
        const startYear = searchParams.get("startYear");
        const endYear = searchParams.get("endYear");

        if (genre && startYear && endYear && !isFetchComplete) {
          await handleSearch(genre, startYear, endYear);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [isFetchComplete]);

  const handleSearch = useCallback(
    debounce(async (genre, startYear, endYear) => {
      if (isFetchComplete) return; // Prevent further fetching if already complete

      setIsSearching(true);
      const accessToken = getAccessToken();

      if (accessToken) {
        try {
          console.log(
            `Searching tracks for genre: ${genre}, startYear: ${startYear}, endYear: ${endYear}`
          );
          const fetchedTracks = await fetchGenreDate(
            accessToken,
            genre,
            startYear,
            endYear
          );
          const sortedTracks = fetchedTracks.sort(
            (a, b) => b.popularity - a.popularity
          );
          const trackIds = sortedTracks.map((track) => track.id);
          setTracks(sortedTracks);

          await fetchAndSetAudioFeatures(accessToken, trackIds);
          setIsFetchComplete(true); // Mark fetch as complete after successful fetch
        } catch (error) {
          console.error("Error fetching search results:", error);
          setError(
            "Failed to fetch search results. Please check your internet connection."
          );
        } finally {
          setIsSearching(false);
        }
      } else {
        console.error("Access token not found in local storage");
        setError("Access token not found. Please authorize the application.");
        setIsSearching(false);
      }
    }, 500), // Debounce delay
    [isFetchComplete]
  );

  const fetchAndSetAudioFeatures = useCallback(
    debounce(async (accessToken, trackIds) => {
      try {
        console.log(`Fetching audio features for trackIds: ${trackIds}`);
        const features = {
          danceability: [],
          energy: [],
          loudness: [],
          speechiness: [],
          acousticness: [],
          instrumentalness: [],
          liveness: [],
          valence: [],
          tempo: [],
        };

        const featurePromises = trackIds.map((id) =>
          fetchAudioFeatures(accessToken, [id])
        );

        const featureResults = await Promise.all(featurePromises);

        featureResults.forEach((feature) => {
          if (feature.length === 0) return;
          const af = feature[0];
          features.danceability.push(af.danceability);
          features.energy.push(af.energy);
          features.loudness.push(af.loudness);
          features.speechiness.push(af.speechiness);
          features.acousticness.push(af.acousticness);
          features.instrumentalness.push(af.instrumentalness);
          features.liveness.push(af.liveness);
          features.valence.push(af.valence);
          features.tempo.push(af.tempo);
        });

        setAudioFeatures(features);
      } catch (error) {
        console.error("Error fetching audio features:", error);
        setError(
          `Failed to fetch audio features: ${error.message}. Please check your internet connection.`
        );
      }
    }, 300),
    []
  );

  // New function to fetch audio analysis
  const fetchAndSetAudioAnalysis = async (trackId) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error("Access token not found in local storage");
      setError("Access token not found. Please authorize the application.");
      return;
    }

    try {
      const analysis = await fetchAudioAnalysis(accessToken, trackId);
      setAudioAnalysis(analysis);
    } catch (error) {
      console.error("Error fetching audio analysis:", error);
      setError(
        "Failed to fetch audio analysis. Please check your internet connection."
      );
    }
  };

  useEffect(() => {
    const genre = searchParams.get("genre");
    const startYear = searchParams.get("startYear");
    const endYear = searchParams.get("endYear");

    if (
      genre &&
      startYear &&
      endYear &&
      prevSearchParams.current !== `${genre}-${startYear}-${endYear}`
    ) {
      prevSearchParams.current = `${genre}-${startYear}-${endYear}`;
      handleSearch(genre, startYear, endYear);
    }
  }, [searchParams, handleSearch]);

  const handleSlideChange = (current) => {
    setCurrentSlide(current);
  };

  const renderCarousel = () => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      afterChange: handleSlideChange,
      centerPadding: "20px",
      swipeToSlide: true,
      touchMove: true,
    };

    return (
      <div className="carousel">
        <Slider ref={sliderRef} {...settings}>
          {tracks.map((track) => (
            <Thumbnail
              key={track.id}
              track={track}
              fetchAndSetAudioAnalysis={fetchAndSetAudioAnalysis} // Pass the new function as a prop
            />
          ))}
        </Slider>
        <div className="carousel-dots">
          {Array.from({ length: Math.ceil(tracks.length / 4) }).map(
            (_, index) => (
              <div
                key={index}
                className={`carousel-dot ${
                  index === Math.floor(currentSlide / 4) ? "active" : ""
                }`}
                onClick={() => sliderRef.current.slickGoTo(index * 4)}
              />
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <SearchContext.Provider
      value={{
        genreSeeds,
        error,
        tracks,
        searchParams,
        setSearchParams,
        audioFeatures,
        audioAnalysis,
        fetchAndSetAudioAnalysis, // Include this in the context
        handleSearch,
        renderCarousel,
        isSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider };
