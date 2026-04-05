import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';

function HomePage() {
  return (
    <section className="page-container">
      <SectionTitle
        title="SIMFAT"
        subtitle="Sistema Integrado de Monitoreo y Alerta Temprana Forestal"
      />

      <p>
        Plataforma para registrar perdida de cobertura forestal, eventos de alerta, reglas de monitoreo y visualizaciones
        para apoyo a la toma de decisiones ambientales.
      </p>

      <div className="quick-links">
        <Link to="/dashboard" className="quick-link">Dashboard</Link>
        <Link to="/regions" className="quick-link">Regiones</Link>
        <Link to="/forest-loss" className="quick-link">Perdida Forestal</Link>
        <Link to="/alerts" className="quick-link">Alertas</Link>
        <Link to="/rules" className="quick-link">Reglas</Link>
      </div>
    </section>
  );
}

export default HomePage;
