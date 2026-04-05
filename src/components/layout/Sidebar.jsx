import { NavLink } from 'react-router-dom';

const sidebarLinks = [
  { label: 'Resumen General', to: '/' },
  { label: 'Indicadores', to: '/dashboard' },
  { label: 'Regiones', to: '/regions' },
  { label: 'Registros de Perdida', to: '/forest-loss' },
  { label: 'Eventos de Alerta', to: '/alerts' },
  { label: 'Reglas de Alerta', to: '/rules' }
];

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menu lateral">
      <h2>Modulos</h2>
      <ul>
        {sidebarLinks.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
