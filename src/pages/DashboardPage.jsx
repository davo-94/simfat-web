import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import MetricCard from '../components/MetricCard';
import SectionTitle from '../components/SectionTitle';
import {
  getDashboardAlertsSummary,
  getDashboardCriticalRegions,
  getDashboardLossTrend,
  getDashboardSummary
} from '../services';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [criticalRegions, setCriticalRegions] = useState([]);
  const [lossTrend, setLossTrend] = useState([]);
  const [alertsSummary, setAlertsSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadDashboard() {
    setLoading(true);
    setError(null);

    try {
      const [summaryData, criticalData, trendData, alertsData] = await Promise.all([
        getDashboardSummary(),
        getDashboardCriticalRegions(),
        getDashboardLossTrend(),
        getDashboardAlertsSummary()
      ]);

      setSummary(summaryData || null);
      setCriticalRegions(Array.isArray(criticalData) ? criticalData : []);
      setLossTrend(Array.isArray(trendData) ? trendData : []);
      setAlertsSummary(Array.isArray(alertsData) ? alertsData : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <section className="page-container">
      <SectionTitle title="Dashboard" subtitle="Indicadores generales y alertas tempranas" />

      {loading ? <LoadingSpinner label="Cargando dashboard..." /> : null}
      {!loading && error ? <ErrorMessage error={error} onRetry={loadDashboard} /> : null}

      {!loading && !error ? (
        <>
          <div className="metrics-grid">
            <MetricCard label="Total ha perdidas" value={summary?.totalHectareasPerdidas ?? '-'} />
            <MetricCard label="Total alertas" value={summary?.totalAlertas ?? '-'} />
            <MetricCard label="Anio mayor perdida" value={summary?.anioMayorPerdida ?? '-'} />
            <MetricCard label="Tendencia" value={summary?.tendenciaGeneral ?? '-'} />
          </div>

          <div className="dashboard-grid">
            <article className="dashboard-card">
              <h3>Tendencia de perdida</h3>
              {lossTrend.length === 0 ? (
                <EmptyState title="Sin tendencia" description="No hay datos para mostrar en la serie de perdida." />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={lossTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="anio" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="hectareasPerdidas" stroke="#0b5cab" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </article>

            <article className="dashboard-card">
              <h3>Resumen de alertas</h3>
              {alertsSummary.length === 0 ? (
                <EmptyState title="Sin resumen" description="No hay datos para mostrar en alertas." />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={alertsSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#2f855a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </article>
          </div>

          <article className="dashboard-card">
            <h3>Regiones criticas</h3>
            {criticalRegions.length === 0 ? (
              <EmptyState title="Sin regiones criticas" description="No hay registros de criticidad." />
            ) : (
              <ul className="critical-list">
                {criticalRegions.map((region, index) => (
                  <li key={region.id || index}>
                    <strong>{region.nombre || region.region || 'Region'}</strong>
                    <span>{region.valorCriticidad || region.hectareasPerdidas || region.totalAlertas || '-'}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </>
      ) : null}
    </section>
  );
}

export default DashboardPage;
