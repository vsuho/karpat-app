import React from "react";
import "../src/styles/getStats.css";
import { OrbitProgress } from "react-loading-indicators";

function PlayerStatsList({ stats, loading, error, sortBy, onSortChange }) {
  return (
    <>
      <div className="getstats-sort-controls">
        <label htmlFor="sort-select">Sort by: </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={onSortChange}
          className="getstats-dropdown"
        >
          <option value="points">Points</option>
          <option value="goals">Goals</option>
          <option value="games">Games Played</option>
          <option value="assists">Assists</option>
        </select>
      </div>

      {loading && <p className="getstats-loading"> <OrbitProgress color="#ffd610" size="medium" text="" textColor="" /> </p>}
      {error && <p className="getstats-error">Error: {error}</p>}
      {stats && stats.length > 0 && (
        <div className="getstats-list">
          {stats.map((player) => (
            <div key={player.playerId} className="getstats-player">
              <p><strong color>#{player.jersey} {player.firstName} {player.lastName}</strong></p>
              <p>Games played: {player.playedGames} | Goals: {player.goals} | Assists: {player.assists} | Points: {player.points}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default PlayerStatsList;
