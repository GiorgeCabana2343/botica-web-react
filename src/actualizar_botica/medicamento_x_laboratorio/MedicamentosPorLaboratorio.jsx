import { useState, useEffect } from 'react';
import API from '../../backend/conexion.js'; 
import './MedicamentosPorLaboratorio.css';

function MedicamentosPorLaboratorio() {
  const user = JSON.parse(localStorage.getItem("user"));
  const idSucursal = user?.idSucursal;

  const [laboratorios, setLaboratorios] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const response = await API.get('/laboratorios/activos'); 
        setLaboratorios(response.data);
      } catch (err) {
        console.error("Error al cargar laboratorios:", err);
        setError('No se pudieron cargar los laboratorios.');
      }
    };
    fetchLaboratorios();
  }, []);

  useEffect(() => {
    if (!selectedLabId || !idSucursal) {
      setMedicamentos([]); 
      return;
    }

    const fetchMedicamentosPorLaboratorio = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await API.get(
          `/medicamentos/laboratorio/${selectedLabId}?sucursal=${idSucursal}`
        );
        
        setMedicamentos(response.data);
      } catch (err) {
        console.error("Error al cargar medicamentos por laboratorio:", err);
        setError('Error al cargar los medicamentos.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentosPorLaboratorio();
  }, [selectedLabId, idSucursal]);

  return (
    <div className="reporte-container">
      <h1 className="reporte-title">Lista de Medicamentos por Laboratorio</h1>
      
      <div className="reporte-header">
        <label htmlFor="laboratorio-select">Laboratorio:</label>
        <select 
          id="laboratorio-select" 
          value={selectedLabId} 
          onChange={(e) => setSelectedLabId(e.target.value)} 
          className="reporte-select"
        >
          <option value="">-- Seleccione un laboratorio --</option>
          {laboratorios.map((lab) => (
            <option key={lab.id} value={lab.id}>
              {lab.descripcion}
            </option>
          ))}
        </select>
      </div>

      {!idSucursal && <p className="error-message">No se pudo detectar la sucursal del usuario.</p>}
      {error && <p className="error-message">{error}</p>}

      <table className="reporte-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Tipo de Medicamento</th>
            <th>Laboratorio</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="status-message">Cargando...</td>
            </tr>
          ) : medicamentos.length > 0 ? (
            medicamentos.map((med) => (
              <tr key={med.id}>
                <td>{med.id}</td>
                <td>{med.nombre}</td>
                <td>S/ {Number(med.precio).toFixed(2)}</td>
                <td>{med.stock}</td>
                <td>{med.tipoMedicamento}</td>
                <td>{med.laboratorio}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="status-message">
                {selectedLabId ? "No se encontraron medicamentos para este laboratorio." : "Seleccione un laboratorio para ver los resultados."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MedicamentosPorLaboratorio;