import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MainLayout from './components/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import RegistrarMedicamento from "./pages/RegistroMedicamento.jsx";
import TipoMedicamento from './pages/TipoMedicamento.jsx';
import RegistroLaboratorio from './pages/RegistroLaboratorio.jsx';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/registrar-medicamento"
            element={<RegistrarMedicamento />}
          />
          <Route
            path="/tipos-medicamento"
            element={<TipoMedicamento />}
          />
          <Route
            path="/registrar-laboratorio"
            element={<RegistroLaboratorio />}
          />
        </Route>

      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;