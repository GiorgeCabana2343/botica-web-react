import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MainLayout from './components/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Medicamento from "./registros_botica/medicamento/Medicamento.jsx";
import TipoMedicamento from './registros_botica/tipo_medicamento/TipoMedicamento.jsx';
import Laboratorio from './registros_botica/laboratorio/Laboratorio.jsx';
import './App.css';
import ActualizarStock from './actualizar_botica/actualizar_stock/ActualizarStock.jsx';
import ActualizarMedicamento from "../src/actualizar_botica/actualizar-medicamento/ActualizarMedicamento.jsx";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/registrar-medicamento" element={<Medicamento />} />
          <Route path="/registrar-tipos-medicamento" element={<TipoMedicamento />} />
          <Route path="/registrar-laboratorio" element={<Laboratorio />} />
          <Route path="/actualizar-stock" element={<ActualizarStock />} />
          <Route path="/actualizar-medicamento" element={<ActualizarMedicamento />} />
        </Route>


      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;