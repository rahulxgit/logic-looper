import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App.jsx";
import "./index.css";

import { dbPromise } from "./services/indexedDB";

async function initializeDB() {
  try {
    await dbPromise;
    console.log("✅ IndexedDB initialized");
  } catch (error) {
    console.error("❌ IndexedDB initialization failed:", error);
    console.warn("App will continue without offline storage.");
  }
}

initializeDB();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
