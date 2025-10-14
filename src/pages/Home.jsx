import { useAuth } from '../context/AuthContext';

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <h1>¡Bienvenido a la página de inicio! ✨</h1>
      {user && (
        <div>
          <p>Hola, <strong>{user.nombre}</strong></p>
          <button onClick={logout}>Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
}

export default Home;