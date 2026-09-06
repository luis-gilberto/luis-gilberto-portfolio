import { Navigate, Route, Routes } from "react-router-dom";
import { CaseEn } from "./pages/CaseEn";
import { CaseEsUnavailable } from "./pages/CaseEsUnavailable";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CaseEn />} />
      <Route path="/es" element={<CaseEsUnavailable />} />
      <Route path="/es/" element={<CaseEsUnavailable />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
