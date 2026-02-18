import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ✅ IndexedDB initialization
import { dbPromise } from "./services/indexedDB";

/**
 * ============================================
 * INITIALIZE INDEXEDDB (NON-BLOCKING)
 * ============================================
 * - App should not wait for DB
 * - App should not crash if DB fails
 * - Production-safe logging
 */
async function initializeDB() {
  try {
    await dbPromise;
    console.log("✅ IndexedDB initialized (logicLooperDB ready)");
  } catch (error) {
    console.error("❌ IndexedDB initialization failed:", error);
    console.warn("App will continue without offline storage.");
  }
}

// run DB init in background
initializeDB();

/**
 * ============================================
 * START REACT APP
 * ============================================
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
