import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SANProvider } from "./features/san/SANContext";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/animations.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SANProvider>
      <App />
    </SANProvider>
  </React.StrictMode>
);
