import React from "react";
import { authorize } from "../components/AuthUtils";

const HomePage = () => {
  const handleAuthorization = () => {
    authorize();
  };

  return (
    <div class= "container">
      <h1>Welcome to the Music Search App</h1>{" "}
      <button onClick={handleAuthorization} className="cta-button">
        Go to Search Page
      </button>
    </div>
  );
};

export default HomePage;
