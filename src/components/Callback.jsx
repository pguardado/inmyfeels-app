import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccessTokenFromUrl,
  storeAccessToken,
} from "../components/AuthUtils";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessTokenFromUrl();
    if (token) {
      storeAccessToken(token);
      console.log("Access token stored in local storage:", token);
      navigate("/search");
    } else {
      console.error("Access token not found in URL");
    }
  }, [navigate]);

  return (
    <div>
      Callback
      {!getAccessTokenFromUrl() && (
        <p>Access token not found in URL. Please try logging in again.</p>
      )}
    </div>
  );
};

export default Callback;
