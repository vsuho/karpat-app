import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/styles/getStats.css";
import PlayerStatsList from "./playerStatsList";

// Beginning season 95-96 for All-time stats
const FIRST_SEASON = 1995;

function AllTimeStats({ allTime, onToggleAllTime }) {
// State variables to hold stats data, loading status, error message, sort option, and regular season/playoffs toggle
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("points"); // Track the selected sort option
  const [regularSeason, setRegularSeason] = useState(true);

// useEffect hook that runs when the component mounts or when regularSeason changes
  useEffect(() => {
    const currentYear = new Date().getFullYear() + 1;
    // Use 'runkosarja' for regular season, 'playoffs' for playoffs
    const mode = regularSeason ? "runkosarja" : "playoffs";
    setLoading(true);
    setError(null); // Clear previous errors
    // Fetch the summed stats for every season from FIRST_SEASON to the current season
    axios.get(`https://liiga.fi/api/v2/players/stats/summed/${FIRST_SEASON}/${currentYear}/${mode}/false?team=kärpät&dataType=basicStats&splitTeams=true`)
      .then((response) => {
        // Check if response is an array and has data
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Sort the data by points in descending order
          const sortedData = [...response.data].sort((a, b) => (b.points || 0) - (a.points || 0));
          // Store the sorted API response in the stats variable
          setStats(sortedData);
        } else {
          // No data available for this mode
          setStats([]);
          setError(`No all-time ${mode === "playoffs" ? "playoff" : "regular season"} data available`);
        }
        // The data has been fetched, set loading to false
        setLoading(false);
      })
      // If the request fails:
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [regularSeason]); // Re-fetch when regularSeason changes

  // Handler for sort dropdown change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    const key = value === "games" ? "playedGames" : value;
    // Create a new sorted array copy and update state
    setStats((current) => current && [...current].sort((a, b) => (b[key] || 0) - (a[key] || 0)));
  };

  return (
    <div className="getstats-container">
      <h3>Kärpät players</h3>

      {/* Toggle between regular season and playoffs */}
      <div className="getstats-controls">
        <button onClick={() => setRegularSeason(!regularSeason)} className="getstats-mode-btn">
          {regularSeason ? "Playoffs" : "Regular season"}
        </button>
      </div>

      <p className="mode-text">All-time {regularSeason ? "Regular season" : "Playoffs"}</p>

      {/* Toggle between season stats and all-time stats */}
      <div className="getstats-controls">
        <button onClick={onToggleAllTime} className="getstats-mode-btn">
          {allTime ? "Season Stats" : "All Time Stats"}
        </button>
      </div>

      <PlayerStatsList
        stats={stats}
        loading={loading}
        error={error}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
    </div>
  );
}

export default AllTimeStats;
