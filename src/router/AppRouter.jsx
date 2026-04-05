import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import RegionsPage from '../pages/RegionsPage';
import ForestLossPage from '../pages/ForestLossPage';
import AlertsPage from '../pages/AlertsPage';
import RulesPage from '../pages/RulesPage';
import NotFoundPage from '../pages/NotFoundPage';

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/regions" element={<RegionsPage />} />
        <Route path="/forest-loss" element={<ForestLossPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
