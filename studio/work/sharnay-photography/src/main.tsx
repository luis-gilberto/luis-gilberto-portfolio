import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { folioEsHarvest } from "./content/folio-es";
import { implementationMap } from "./content/source-map";
import "./styles/case.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename="/studio/work/sharnay-photography">
      <App />
    </BrowserRouter>
  </StrictMode>,
);

if (import.meta.env.DEV) {
  console.info("[sharnay] slice 01 ready · hero → chapter 03");
  console.info("[sharnay] Folio ES harvested, published:", folioEsHarvest.published);
  console.info("[sharnay] implementation map rows:", implementationMap.length);
}
