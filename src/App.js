import React from "react";
import GetStats from "./getStats";

function App() {
  const appStyle = {
    backgroundImage: 'url("/ice.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    height: "100vh",
    width: "100vw",
    margin: "0",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };


  return (
    <div className="app" style={appStyle}>
      <h1 style={{ color: "black" }}>Siltsu's Soosinki</h1>
      <GetStats />
      <p></p>
    </div>
  );
}

export default App;
