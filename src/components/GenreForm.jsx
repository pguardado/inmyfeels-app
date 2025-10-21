import React, { useState } from "react";

const GenreForm = ({ genreSeeds = [], onSubmit }) => {
  const [genre, setGenre] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [error, setError] = useState("");

  const handleYearChange = (e, setter) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(startYear) > parseInt(endYear)) {
      setError("Start year cannot be greater than end year");
    } else {
      setError("");
      onSubmit(genre, startYear, endYear);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <div>
        <label htmlFor="genre">
          Genre:
          <select
            id="genre"
            name="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">Select Genre</option>
            {genreSeeds.map((seed) => (
              <option key={seed} value={seed}>
                {" "}
                {seed}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="startYear">
          Start Year:
          <input
            type="text"
            id="startYear"
            name="startYear"
            value={startYear}
            onChange={(e) => handleYearChange(e, setStartYear)}
            placeholder="YYYY"
          />
        </label>
      </div>
      <div>
        <label htmlFor="endYear">
          End Year:
          <input
            type="text"
            id="endYear"
            name="endYear"
            value={endYear}
            onChange={(e) => handleYearChange(e, setEndYear)}
            maxLength="4"
            placeholder="YYYY"
          />
        </label>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      <button type="submit">Search</button>
    </form>
  );
};

export default GenreForm;
