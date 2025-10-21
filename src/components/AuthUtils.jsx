import Bottleneck from "bottleneck";

const { VITE_SPOTIFY_CLIENT_ID, VITE_SPOTIFY_REDIRECT_URI } = import.meta.env;

export const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const authorize = () => {
  const state = generateRandomString(16);
  localStorage.setItem("spotify_auth_state", state);
  const scope = "user-read-private user-read-email";

  let url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(VITE_SPOTIFY_CLIENT_ID);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(VITE_SPOTIFY_REDIRECT_URI);
  url += "&state=" + encodeURIComponent(state);

  window.location.href = url;
};

export const getAccessTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.get("access_token");
};

export const storeAccessToken = (token) => {
  localStorage.setItem("spotify_access_token", token);
};

export const getAccessToken = () => {
  return localStorage.getItem("spotify_access_token");
};

export const clearAccessToken = () => {
  localStorage.removeItem("spotify_access_token");
};

export const fetchGenreSeeds = async (accessToken, maxRetries = 3) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const url =
        "https://api.spotify.com/v1/recommendations/available-genre-seeds";
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      console.log("Fetching genre seeds with URL:", url);
      console.log("Headers:", headers);

      const response = await fetch(url, { headers });

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || 5;
        console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        retries++;
        continue;
      }

      if (!response.ok) {
        console.error(`Error fetching genre seeds: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      console.log("Genre seeds fetched successfully:", data.genres);
      return data.genres;
    } catch (error) {
      console.error("Error fetching genre seeds:", error);
      return [];
    }
  }

  console.error("Exceeded maximum retries for fetching genre seeds.");
  return [];
};

export const fetchGenreDate = async (
  accessToken,
  genre,
  startYear,
  endYear
) => {
  const limit = 50;
  let tracks = [];
  let offset = 0;
  let url = `https://api.spotify.com/v1/search?q=genre:${genre}%20year:${startYear}-${endYear}&type=track&limit=${limit}&offset=${offset}`;

  while (true) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error(
          `Error fetching tracks: ${response.status} ${response.statusText}`
        );
        throw new Error(
          "Failed to fetch genre and date. Status: " + response.status
        );
      }

      const data = await response.json();
      console.log("Data from Spotify API:", data);

      const formattedTracks = data.tracks.items.map((track) => ({
        id: track.uri.split(":")[2],
        name: track.name,
        artists: Array.isArray(track.artists)
          ? track.artists.map((artist) => artist.name).join(", ")
          : "Unknown Artists",
        popularity: track.popularity,
        album_name: track.album.name,
        href: track.album.href,
        uri: track.album.uri,
        image: track.album.images[0]?.url, // Get the first image (largest)
        external_urls: track.album.external_urls, // Ensure external_urls is included
      }));

      tracks = [...tracks, ...formattedTracks];

      if (!data.tracks.next) {
        break;
      }

      url = data.tracks.next;
    } catch (error) {
      console.error(
        `Error fetching genre and date from endpoint: ${url}`,
        error.message,
        error.stack
      );
      throw error;
    }
  }

  console.log("Total tracks fetched:", tracks.length);
  console.log("Tracks:", tracks);
  return tracks;
};

export const fetchAudioFeatures = async (
  accessToken,
  trackIds,
  retries = 5
) => {
  const idsParam = trackIds.join(",");

  const url = `https://api.spotify.com/v1/audio-features?ids=${idsParam}`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let data = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const responseData = await response.json();
        data = responseData.audio_features;
        break;
      } else if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || 1;
        const retryAfterMs = retryAfter * 1000;
        console.warn(
          `Rate limit exceeded. Retrying after ${retryAfter} seconds...`
        );

        await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching audio features:", error);
      if (attempt === retries) {
        throw error;
      }

      const backoffTime = Math.pow(2, attempt) * 1000;
      console.warn(
        `Attempt ${attempt} failed. Retrying in ${
          backoffTime / 1000
        } seconds...`
      );

      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }

  return data || [];
};

export const fetchAudioAnalysis = async (accessToken, trackId) => {
  try {
    console.log("Fetching audio analysis for track ID:", trackId);
    const response = await fetch(
      `https://api.spotify.com/v1/audio-analysis/${trackId}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed Audio Analysis. Status: " + response.status);
    }

    const data = await response.json();
    console.log("Audio Analysis fetched successfully: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching Audio Analysis:", error);
    throw error;
  }
};

export const fetchTrackDetails = async (accessToken, trackId) => {
  try {
    console.log("Fetching track details for track ID:", trackId);
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${encodeURIComponent(trackId)}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch track details. Status: " + response.status
      );
    }

    const data = await response.json();
    console.log("Track details fetched successfully: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching track details:", error);
    throw error;
  }
};
