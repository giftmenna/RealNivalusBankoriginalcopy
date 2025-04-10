import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import remote-origin Remix icons CSS
import "remixicon/fonts/remixicon.css";

// Create and render app
createRoot(document.getElementById("root")!).render(<App />);
