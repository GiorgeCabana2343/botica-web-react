import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Dropdown from './Dropdown.jsx'; 


const mantenimientoItems = [
  { title: 'Medicamentos', subtitle: 'Gestionar productos farmacéuticos', path: '/medicamentos', icon: '💊' },
  { title: 'Tipos de Medicamentos', subtitle: 'Categorías de productos', path: '/tipos-medicamento', icon: '🏷️' },
  { title: 'Laboratorios', subtitle: 'Gestionar proveedores', path: '/laboratorios', icon: '🔬' },
];

const inventarioItems = [
  { title: 'Actualizar Medicamento', subtitle: 'Editar precios, descripciones, etc.', path: '/inventario/actualizar-medicamento', icon: '✏️' },
  { title: 'Actualizar Stock', subtitle: 'Añadir o quitar unidades del inventario', path: '/inventario/actualizar-stock', icon: '📦' },
  { title: 'Medicamentos por Laboratorio', subtitle: 'Ver productos agrupados por proveedor', path: '/reportes/por-laboratorio', icon: '📊' },
  { title: 'Medicamentos por Tipo', subtitle: 'Ver productos agrupados por categoría', path: '/reportes/por-tipo', icon: '📈' },
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
        <Link to="/" className="navbar-brand">MIFARMA</Link>
        
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
              <span>Bienvenido, {user.nombre}</span>
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