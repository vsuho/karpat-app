import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/styles/getStats.css";
import { OrbitProgress } from "react-loading-indicators";
import GetAllTimeStats from "./AllTimeStats";


function GetStats() {
// State variables to hold stats data, loading status, error message, and all-time toggle
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTime, setAllTime] = useState(false);
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
  }, []); // Re-fetch when regularSeason changes

  // Handler function for sorting by different stats
  const handleSort = (sortBy) => {
    if (stats) {
      // Create a new array copy and sort it
      const sorted = [...stats].sort((a, b) => {
        let aValue, bValue;
        
        if (sortBy === "points") {
          aValue = a.points || 0;
          bValue = b.points || 0;
        } else if (sortBy === "goals") {
          aValue = a.goals || 0;
          bValue = b.goals || 0;
        } else if (sortBy === "assists") {
          aValue = a.assists || 0;
          bValue = b.assists || 0;
        } else if (sortBy === "games") {
          aValue = a.playedGames || 0;
          bValue = b.playedGames || 0;
        }
        
        // Return negative, zero, or positive for proper sorting
        return bValue - aValue;
      });
      // Update state with the sorted array
      setStats(sorted);
    }
  };

  // Handler for sort dropdown change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    handleSort(e.target.value);
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
    {allTime ? (
      <GetAllTimeStats />
    ) : (
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
        <button onClick={() => handleModeToggle(!regularSeason)} className="getstats-mode-btn">
          {regularSeason ? 'Playoffs' : 'Regular season'}
        </button>
      </div>

      {/* Sort dropdown */}
      
      <div className="getstats-sort-controls">
        <label htmlFor="sort-select">Sort by: </label>
        <select 
          id="sort-select" 
          value={sortBy} 
          onChange={handleSortChange}
          className="getstats-dropdown"
        >
          <option value="points">Points</option>
          <option value="goals">Goals</option>
          <option value="games">Games Played</option>
          <option value="assists">Assists</option>
        </select>
        <button 
          onClick={() => setAllTime(!allTime)} 
          className="getstats-mode-btn"
        >
          {allTime ? 'Back to Season Stats' : 'All Time Stats'}
        </button>
      </div>
      

      <p className="mode-text">{allTime ? "All-time" : `${selectedSeason - 1}-${selectedSeason}`} {regularSeason ? "Regular season" : "Playoffs"}</p>

      {/* Show all-time stats if allTime is true */}
      
        
          {/* If loading is true, show the loading spinner animation */}
          {loading && <p className="getstats-loading"> <OrbitProgress color="#ffd610" size="medium" text="" textColor="" /> </p>}
          {/* If there was an error, display the error message */}
          {error && <p className="getstats-error">Error: {error}</p>}
          {/* Only render the player list if stats exist and the array has at least one player */}
          {stats && stats.length > 0 && (
            // Scrollable container div for the list of players
            <div className="getstats-list">
              {/* Transform the stats array into individual player cards */}
              {stats
                // Create a shallow copy of the array (prevents mutating the original)
                .slice()
                .map((player) => (
                  // Individual player card div with a unique key
                  <div key={player.playerId} className="getstats-player">
                    <p><strong>#{player.jersey} {player.firstName} {player.lastName}</strong></p>
                    <p>Games played: {player.playedGames} | Goals: {player.goals} | Assists: {player.assists} | Points: {player.points}</p>
                  </div>
                ))}
            </div>
          )}
    </div>
    )}
    </>
  );
}

export default GetStats;
