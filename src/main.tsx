import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Navigate from "./components/navigate/Navigate";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
// ReactDOM.createRoot(document.getElementById("navigate")!).render(
//   <React.StrictMode>
//     <ConvexProvider client={convex}>
//       <Navigate />
//     </ConvexProvider>
//   </React.StrictMode>
// );