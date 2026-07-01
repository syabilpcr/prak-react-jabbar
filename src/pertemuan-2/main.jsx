import { createRoot } from "react-dom/client";
import BioData from "./BioData";
import Container from "./Container"; 
import "./custom.css";

createRoot(document.getElementById("root")).render(
  // Kita bungkus BioData dengan Container di sini
  <Container>
    <BioData />
  </Container>,
);
