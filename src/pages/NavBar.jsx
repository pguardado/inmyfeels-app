import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/search" className="nav-link">
            Search
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/analysis" className="nav-link">
            Analysis
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/results" className="nav-link">
            Results
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; // Exporting the Navbar component
