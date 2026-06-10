import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/styles/getStats.css";
import PlayerStatsList from "./playerStatsList";


function GetStats({ allTime, onToggleAllTime }) {
// State variables to hold stats data, loading status, and error message
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to track the selected season
  const [selectedSeason, setSelectedSeason] = useState("2026");
  const [regularSeason, setRegularSeason] = useState(true);
  const [sortBy, setSortBy] = useState("points"); // Track the selected sort option
  // State to track available seasons - generates last 26 years dynamically
  const currentYear = new Date().getFullYear() + 1;
  const [availableSeasons] = useState(
    Array.from({ length: 26 }, (_, i) => String(currentYear - i)).sort((a, b) => parseInt(b) - parseInt(a))
  );

// Function to fetch stats for a specific season
  const fetchStats = (season, mode) => {
    setLoading(true);
    setError(null); // Clear previous errors
    // Fetch season stats 
    axios.get(`https://liiga.fi/api/v2/players/stats/summed/${season}/${season}/${mode}/false?team=kärpät&dataType=basicStats&splitTeams=true`)
      .then((response) => {
        // Log the response data to the console for debugging
        console.log(response.data);
        // Check if response is an array and has data
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Sort the data by points in descending order
          const sortedData = [...response.data].sort((a, b) => (b.points || 0) - (a.points || 0));
          // Store the sorted API response in the stats variable
          setStats(sortedData);
          setError(null);
        } else {
          // No data available for this season/mode combination
          setStats([]);
          setError(`No ${mode === 'playoffs' ? 'playoff' : 'regular season'} data available for ${season}`);
        }
        // The data has been fetched, set loading to false
        setLoading(false);
      })
      // If the request fails:
      .catch((error) => {
        // Log the error to the console for debugging
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  };


// useEffect hook that runs once when the component first mounts or when regularSeason changes
  useEffect(() => {
    // Fetch the selected season data - use 'runkosarja' for regular season, 'playoffs' for playoffs
    const mode = regularSeason ? 'runkosarja' : 'playoffs';
    fetchStats(selectedSeason, mode);
  }, [regularSeason, selectedSeason]); // Re-fetch when regularSeason changes

  // Handler for sort dropdown change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    const key = value === "games" ? "playedGames" : value;
    setStats((current) => current && [...current].sort((a, b) => (b[key] || 0) - (a[key] || 0)));
  };

  // Handler for season change
  const handleSeasonChange = (e) => {
    const season = e.target.value;
    setSelectedSeason(season);
    const mode = regularSeason ? 'runkosarja' : 'playoffs';
    fetchStats(season, mode);
  };

  // Handler for toggling between regular season and playoffs
  const handleModeToggle = (mode) => {
    setRegularSeason(mode);
    const selectedMode = mode ? 'runkosarja' : 'playoffs';
    fetchStats(selectedSeason, selectedMode);
  };

  return (
    <>

    <div className="getstats-container">
      <h3>Kärpät players</h3>
      
      {/* Season dropdown selector */}
      <div className="getstats-controls">
        <label htmlFor="season-select">Select Season: </label>
        <select 
          id="season-select" 
          value={selectedSeason} 
          onChange={handleSeasonChange}
          className="getstats-dropdown"
        >
          {availableSeasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
        {/* Toggle between regular season and playoffs */}
        <button onClick={() => handleModeToggle(!regularSeason)} className="getstats-mode-btn">
          {regularSeason ? 'Playoffs' : 'Regular season'}
        </button>
      </div>

      <p className="mode-text">{`${selectedSeason - 1}-${selectedSeason}`} {regularSeason ? "Regular season" : "Playoffs"}</p>

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

    </>
  );
}

export default GetStats;
