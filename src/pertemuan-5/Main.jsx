import { createRoot } from 'react-dom/client'
import './tailwind.css';
import CarRentalApp from "./CarRentalApp";

createRoot(document.getElementById("root")).render(
    <StrictMode>
    <CarRentalApp />
    </StrictMode>
);
