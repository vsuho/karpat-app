import React, { useState } from "react";
import GetStats from "./getStats.js";
import AllTimeStats from "./AllTimeStats.js";
import "./styles/getStats.css";

function App() {
  const [allTime, setAllTime] = useState(false);

  const appStyle = {
    backgroundImage: 'url("/ice.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    height: "auto",
    width: "100vw",
    margin: "0",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  };


  return (
    <div className="app" style={appStyle}>
      <h1 style={{ color: "black" }}>Siltsu's Soosinki</h1>
      {allTime ? (
        <AllTimeStats allTime={allTime} onToggleAllTime={() => setAllTime(!allTime)} />
      ) : (
        <GetStats allTime={allTime} onToggleAllTime={() => setAllTime(!allTime)} />
      )}
      <p></p>
    </div>
  );
}

export default App;
