import { useState, useEffect } from 'react';
import API from '../../backend/conexion.js'; 
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
  const user = JSON.parse(localStorage.getItem("user"));
  const idSucursal = user?.idSucursal;
  const [medicamentos, setMedicamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [stockChange, setStockChange] = useState('');

  const fetchMedicamentos = async () => {
    if (!idSucursal) {
      setLoading(false);
      setError("No se pudo identificar la sucursal del usuario.");
      return;
    }
    
    setLoading(true);
    try {

      const url = `http://localhost:3000/api/medicamentos/stock/${idSucursal}`;
      const response = await API.get(url);      
      setMedicamentos(response.data);
    } catch (err) {
      setError('No se pudieron cargar los medicamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(idSucursal) {
        fetchMedicamentos();
    }
  }, [idSucursal]); 

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
      const payload = {
        cantidad: Number(stockChange),
        idSucursal: idSucursal 
      };

      await API.put(`http://localhost:3000/api/medicamentos/${selectedMedicamento.id}/stock`, payload);
      
      handleCloseModal();
      fetchMedicamentos(); 

    } catch (err) {
      console.error("Error al actualizar stock:", err);
      setModalError('Error al actualizar el stock.');
    }
  };

  const filteredMedicamentos = medicamentos.filter(med => 
    med.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="stock-container">
        <h1 className="stock-title">Tabla de Gestión de Stock</h1>

        <div className="stock-header">
          <input 
            type="text" 
            placeholder="Búsqueda por nombre..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="stock-input" 
          />
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
                {filteredMedicamentos.map((med) => (
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