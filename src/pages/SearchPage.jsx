import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context";
import { getAccessToken } from "../components/AuthUtils";
import "../styles/searchPage.css";

const SearchPage = () => {
  const { genreSeeds, handleSearch, isSearching } = useContext(SearchContext);
  const [genre, setGenre] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleYearChange = (e, setYear) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setYear(value);
    }
  };

  const onSearch = async (e) => {
    e.preventDefault();
    setError(null);

    if (parseInt(startYear) > parseInt(endYear)) {
      setError("Start year cannot be greater than end year.");
      return;
    }

    try {
      await handleSearch(genre, startYear, endYear);
      navigate(
        `/result?genre=${genre}&startYear=${startYear}&endYear=${endYear}`
      );
    } catch (error) {
      console.error("Error initiating search:", error);
      setError("Failed to initiate search. Please try again later.");
    }
  };

  return (
    <div className="search-page">
      <h1>Search Page</h1>
      <form onSubmit={onSearch}>
        <div>
          <label htmlFor="genre">Genre:</label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">Select Genre</option>
            {genreSeeds.map((seed) => (
              <option key={seed} value={seed}>
                {seed}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startYear">Start Year:</label>
          <input
            type="text"
            id="startYear"
            value={startYear}
            onChange={(e) => handleYearChange(e, setStartYear)}
          />
        </div>
        <div>
          <label htmlFor="endYear">End Year:</label>
          <input
            type="text"
            id="endYear"
            value={endYear}
            onChange={(e) => handleYearChange(e, setEndYear)}
          />
        </div>
        <button type="submit" disabled={isSearching}>
          Search
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SearchPage;
