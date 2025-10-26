import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Dropdown from './Dropdown.jsx';
import Mifarma from '../assets/MiFarma-logo.png';

const mantenimientoItems = [
  { title: 'Medicamentos', subtitle: 'Gestionar productos farmacéuticos', path: '/registrar-medicamento', icon: '💊' },
  { title: 'Tipos de Medicamentos', subtitle: 'Categorías de productos', path: '/registrar-tipos-medicamento', icon: '🏷️' },
  { title: 'Laboratorios', subtitle: 'Gestionar proveedores', path: '/registrar-laboratorio', icon: '🔬' },
];

const inventarioItems = [
  { title: 'Actualizar Medicamento', subtitle: 'Editar descripciones, etc.', path: '/actualizar-medicamento', icon: '✏️' },
  { title: 'Actualizar Stock', subtitle: 'Añadir o quitar unidades del inventario', path: '/actualizar-stock', icon: '📦' },
  { title: 'Medicamentos por Laboratorio', subtitle: 'Ver productos agrupados por proveedor', path: '/medicamento-por-laboratorio', icon: '📊' },
  { title: 'Medicamentos por Tipo', subtitle: 'Ver productos agrupados por categoría', path: '/medicamento-por-tipo', icon: '📈' },
];


function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="navbar modern">
        <Link to="/" className="navbar-brand">
          <img
            src={Mifarma}
            alt="MIFARMA Logo"
            className="navbar-logo"
          />
        </Link>

        <nav className="navbar-main-links">
          <Link to="/" className="nav-item">Home</Link>
          <Dropdown title="Negocios" items={mantenimientoItems} />
          <Dropdown title="Inventario" items={inventarioItems} />
          <Link to="/ventas" className="nav-item">Ventas</Link>
          <Link to="/reportes" className="nav-item">Reportes</Link>
        </nav>

        <div className="navbar-auth">
          <div className="navbar-user-desktop">
            {user ? (
              <div className="navbar-user">
                <span className="user-greeting">
                  Bienvenido, <strong>{user.nombre}</strong>
                </span>
                <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
              </div>
            ) : (
              <div className="navbar-links">
                <Link to="/login" className="nav-item">Login</Link>
                <Link to="/register" className="nav-item">Registro</Link>
              </div>
            )}
          </div>

          <button className="hamburger-menu" onClick={toggleMobileMenu}>
            &#9776;
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={toggleMobileMenu}>&times;</button>

        {user && (
          <div className="mobile-user-info">
            <h4>Bienvenido,</h4>
            <h3>{user.nombre}</h3>
          </div>
        )}

        <nav className="mobile-nav-links">
          <Link to="/" className="mobile-nav-link" onClick={handleLinkClick}>Home</Link>

          {user ? (
            <>
              <h4 className="mobile-menu-heading">Negocios</h4>
              {mantenimientoItems.map(item => (
                <Link key={item.path} to={item.path} className="mobile-nav-link sub-link" onClick={handleLinkClick}>
                  {item.icon} {item.title}
                </Link>
              ))}

              <h4 className="mobile-menu-heading">Inventario</h4>
              {inventarioItems.map(item => (
                <Link key={item.path} to={item.path} className="mobile-nav-link sub-link" onClick={handleLinkClick}>
                  {item.icon} {item.title}
                </Link>
              ))}

              <h4 className="mobile-menu-heading">Operaciones</h4>
              <Link to="/ventas" className="mobile-nav-link" onClick={handleLinkClick}>Ventas</Link>
              <Link to="/reportes" className="mobile-nav-link" onClick={handleLinkClick}>Reportes</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={handleLinkClick}>Login</Link>
              <Link to="/register" className="mobile-nav-link" onClick={handleLinkClick}>Registro</Link>
            </>
          )}
        </nav>

        {user && (
          <button onClick={handleLogout} className="mobile-logout-button">
            Cerrar Sesión
          </button>
        )}
      </div>

      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;