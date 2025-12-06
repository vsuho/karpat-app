import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Remove default margins and padding to fill the whole page
document.body.style.margin = "0";
document.body.style.padding = "0";
document.documentElement.style.margin = "0";
document.documentElement.style.padding = "0";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
