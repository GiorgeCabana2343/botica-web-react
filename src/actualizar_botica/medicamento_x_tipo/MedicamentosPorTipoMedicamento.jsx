import { useState, useEffect } from 'react';
import axios from 'axios';


function MedicamentosPorTipo() {
    const [tipos, setTipos] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);
    const [selectedTipoId, setSelectedTipoId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tipoMedicamentos/activos');
                setTipos(response.data);
            } catch (err) {
                console.error("Error al cargar los tipos de medicamento:", err);
                setError('No se pudieron cargar los tipos de medicamento.');
            }
        };
        fetchTipos();
    }, []);

    useEffect(() => {
        if (!selectedTipoId) {
            setMedicamentos([]);
            return;
        }

        const fetchMedicamentosPorTipo = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:3000/api/medicamentos/tipo/${selectedTipoId}`);
                setMedicamentos(response.data);
            } catch (err) {
                console.error("Error al cargar medicamentos por tipo:", err);
                setError('Error al cargar los medicamentos para este tipo.');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicamentosPorTipo();
    }, [selectedTipoId]);

    return (
        <div className="reporte-container">
            <h1 className="reporte-title">Lista de Medicamentos por Tipo Medicamento</h1>

            <div className="reporte-header">
                <label htmlFor="tipo-select">Tipo de Medicamento:</label>
                <select
                    id="tipo-select"
                    value={selectedTipoId}
                    onChange={(e) => setSelectedTipoId(e.target.value)}
                    className="reporte-select"
                >
                    <option value="">-- Seleccione un tipo --</option>
                    {tipos.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                            {tipo.descripcion}
                        </option>
                    ))}
                </select>
            </div>

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
                            <td colSpan="5" className="status-message">Cargando...</td>
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
                            <td colSpan="5" className="status-message">
                                {selectedTipoId ? "No hay medicamentos para este tipo." : "Seleccione un tipo para ver los resultados."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MedicamentosPorTipo;