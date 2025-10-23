# inMyFeels — Spotify Audio Analysis App

A full-stack React + Express application that connects to the **Spotify Web API** to explore and visualize a song’s emotional and acoustic characteristics.  
Users can search tracks, analyze their audio features, and view interactive data visualizations built with **Plotly.js**.

---

## Features

- **Spotify API Integration** — Authenticates using a preconfigured client token (no login required).
- **Track Search** — Search by genre, artist, or release date using Spotify’s `/recommendations` and `/search` endpoints.
- **Audio Feature Analysis** — Visualizes metrics such as *danceability, energy, valence, tempo,* and more.
- **Plotly Box Plots** — Interactive box plots display audio-feature distributions.
- **Tooltips** — Hover descriptions for each feature explain its musical meaning.
- **Responsive UI** — Built with React Router, custom CSS classes, and dynamic layouts.
- **Backend Server** — Express server handles token retrieval and Spotify API proxy requests.

---

## Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, React Router, Plotly.js, Axios, CSS Modules |
| **Backend** | Node.js, Express, dotenv |
| **API** | Spotify Web API |
| **Tooling** | npm, ES Modules, Vite Proxy, LocalStorage for tokens |

---

## Project Structure

- **public/** — static assets (favicon, Vite SVG)
- **server/** — Express backend for Spotify API token handling
- **src/**
  - **components/** — UI building blocks (cards, sliders, plots)
  - **pages/** — routed pages (Home, Search, Result, Analysis)
  - **styles/** — CSS modules and layout styling
  - **context.jsx** — React context for state management
  - **App.jsx / main.jsx** — core app entry
- **vite.config.js** — Vite proxy and build settings
- **package.json** — dependencies and scripts
