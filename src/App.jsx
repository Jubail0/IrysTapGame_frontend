import React, { use } from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import GamePage from "./Pages/GamePage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import LeaderboardPage from "./Pages/Leaderboard.jsx";
import GuidePage from "./Pages/GuidePage.jsx";
import { useGameStore } from "./Store/useGameStore.js";

const App = () => {


  return (
    <Router>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/how-it-works" element={<GuidePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
