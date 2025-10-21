// App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AnalysisPage from "./pages/AnalysisPage";
import NavBar from "./pages/NavBar";
import ResultPage from "./pages/ResultPage";
import { SearchProvider } from "./context";
import Callback from "./components/Callback";

const App = () => {
  return (
    <SearchProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/analysis/:trackId" element={<AnalysisPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </SearchProvider>
  );
};

export default App;
