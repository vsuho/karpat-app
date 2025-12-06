import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/styles/getStats.css";
import { OrbitProgress } from "react-loading-indicators";


function GetStats() {
// State variables to hold stats data, loading status, and error message
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// useEffect hook that runs once when the component first mounts
  useEffect(() => {
// Make a GET request to the Liiga API to fetch Kärpät team player statistics
    axios.get("https://liiga.fi/api/v2/players/stats/summed/2026/2026/runkosarja/false?team=kärpät&dataType=basicStats&splitTeams=true")
      // If the request is successful
      .then((response) => {
        // Log the response data to the console for debugging
        console.log(response.data);
        // Store the API response in the stats variable
        setStats(response.data);
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
  }, []); // Empty dependency array means this effect runs only once on component mount

  return (
    <div className="getstats-container">
      <h3>Kärpät players</h3>
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
            // Sort players by points in descending order 
            .sort((a, b) => b.points - a.points)
            .map((player) => (
              // Individual player card div with a unique key
              <div key={player.playerId} className="getstats-player">
                <p><strong>{player.firstName} {player.lastName}</strong></p>
                <p>Games played: {player.playedGames} | Goals: {player.goals} | Assists: {player.assists} | Points: {player.points}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default GetStats;
