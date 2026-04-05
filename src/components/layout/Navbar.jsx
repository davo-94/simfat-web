import { NavLink } from 'react-router-dom';

const topLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Regiones', to: '/regions' },
  { label: 'Pérdida Forestal', to: '/forest-loss' },
  { label: 'Alertas', to: '/alerts' },
  { label: 'Reglas', to: '/rules' }
];

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>SIMFAT</h1>
        <span>Sistema Integrado de Monitoreo y Alerta Temprana Forestal</span>
      </div>
      <nav className="navbar-nav" aria-label="Navegacion principal">
        {topLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
