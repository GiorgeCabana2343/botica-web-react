import { useState, useEffect } from 'react';
import axios from 'axios';
import "./ActualizarStock.css";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}

function ActualizarStock() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [stockChange, setStockChange] = useState('');

  const fetchMedicamentos = async (query = '') => {
    setLoading(true);
    try {
      const url = query
        ? `http://localhost:3000/api/medicamentos/buscar/activos?nombre=${query}`
        : 'http://localhost:3000/api/medicamentos/activos';
      const response = await axios.get(url);
      setMedicamentos(response.data);
    } catch (err) {
      setError('No se pudieron cargar los medicamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMedicamentos(searchTerm);
  };

  const handleEditClick = (medicamento) => {
    setSelectedMedicamento(medicamento);
    setIsModalOpen(true);
    setStockChange('');
    setModalError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedicamento(null);
  };

  const handleUpdateStock = async () => {
    if (!selectedMedicamento || Number(stockChange) <= 0) {
      setModalError('La cantidad a agregar debe ser un número positivo.');
      return;
    }
    setModalError('');

    try {
      await axios.put(`http://localhost:3000/api/medicamentos/${selectedMedicamento.id}/stock`, {
        cantidad: Number(stockChange)
      });
      handleCloseModal();
      fetchMedicamentos(searchTerm);
    } catch (err) {
      setModalError('Error al actualizar el stock.');
    }
  };

  return (
    <>
      <div className="stock-container">
        <h1 className="stock-title">Tabla de Gestión de Stock</h1>

        <div className="stock-header">
          <form onSubmit={handleSearch} className="search-form">
            <input type="text" placeholder="Búsqueda por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="stock-input" />
            <button type="submit" className="stock-button filter-btn">Filtrar</button>
          </form>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? <p>Cargando...</p> : (
          <div className="table-wrapper">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Stock Actual</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map((med) => (
                  <tr key={med.id}>
                    <td>{med.id}</td>
                    <td>{med.nombre}</td>
                    <td>{med.stock}</td>
                    <td>
                      <button onClick={() => handleEditClick(med)} className="action-btn edit-btn">
                        Agregar Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {selectedMedicamento && (
            <div className="modal-body">
              <h2>Agregar Stock a:</h2>
              <h3 className="modal-med-name">{selectedMedicamento.nombre}</h3>
              <p>Stock actual: <strong>{selectedMedicamento.stock}</strong></p>

              <div className="modal-form-group">
                <label>Cantidad a agregar:</label>
                <input
                  type="number"
                  className="modal-input"
                  value={stockChange}
                  onChange={(e) => setStockChange(e.target.value)}
                  placeholder="Ej: 50"
                  min="1"
                />
              </div>

              {modalError && <p className="modal-error">{modalError}</p>}

              <button onClick={handleUpdateStock} className="modal-save-btn">
                Guardar Cambios
              </button>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}

export default ActualizarStock;

