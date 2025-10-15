import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Dropdown from './Dropdown.jsx';
import mi_logo from '../assets/mi_logo.png';


const mantenimientoItems = [
  { title: 'Medicamentos', subtitle: 'Gestionar productos farmacéuticos', path: '/registrar-medicamento', icon: '💊' },
  { title: 'Tipos de Medicamentos', subtitle: 'Categorías de productos', path: '/registrar-tipos-medicamento', icon: '🏷️' },
  { title: 'Laboratorios', subtitle: 'Gestionar proveedores', path: '/registrar-laboratorio', icon: '🔬' },
];

const inventarioItems = [
  { title: 'Actualizar Medicamento', subtitle: 'Editar precios, descripciones, etc.', path: '/actualizar-medicamento', icon: '✏️' },
  { title: 'Actualizar Stock', subtitle: 'Añadir o quitar unidades del inventario', path: '/actualizar-stock', icon: '📦' },
  { title: 'Medicamentos por Laboratorio', subtitle: 'Ver productos agrupados por proveedor', path: '/medicamento/por-laboratorio', icon: '📊' },
  { title: 'Medicamentos por Tipo', subtitle: 'Ver productos agrupados por categoría', path: '/medicamento-por-tipo', icon: '📈' },
];




function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar modern">
        <Link to="/" className="navbar-brand">
          <img
            src={mi_logo}
            alt="MIFARMA Logo"
            className="navbar-logo"
          />
        </Link>

        <nav className="navbar-main-links">
          <Link to="/" className="nav-item">
            Home
          </Link>
          <Dropdown title="Negocios" items={mantenimientoItems} />
          <Dropdown title="Inventario" items={inventarioItems} />
          <Link to="/" className="nav-item">
            Ventas
          </Link>
          <Link to="/" className="nav-item">
            Reportes
          </Link>
        </nav>

        <div className="navbar-auth">
          {user ? (
            <div className="navbar-user">
              <span className="user-greeting">
                Bienvenido, <strong>{user.nombre}</strong>
              </span>
              <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            </div>
          ) : (
            <div className="navbar-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Registro</Link>
            </div>
          )}
        </div>
      </header>

      <main className="container">
        {/* Aquí se renderizarán las páginas correspondientes a las rutas */}
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;