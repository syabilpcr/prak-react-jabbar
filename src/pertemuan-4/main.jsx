import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import PerfumeApp from "./PerfumeApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PerfumeApp />
  </StrictMode>
);


