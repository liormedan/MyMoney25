import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ReportsPage from "./components/reports/ReportsPage";
import TransactionsPage from "./components/transactions/TransactionsPage.jsx";
import SettingsPage from "./components/settings/SettingsPage";
import ObligationsPage from "./components/obligations/ObligationsPage";
import routes from "tempo-routes";
import ProfilePage from "./components/profile/ProfilePage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/obligations" element={<ObligationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
