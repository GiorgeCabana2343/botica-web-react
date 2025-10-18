import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockStyles = () => {
  const styles = `
    .stock-container {
      padding: 2rem;
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }
    .stock-title { color: #ff5e62; margin-top: 0; margin-bottom: 2rem; }
    .stock-header { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 2rem; }
    .stock-input { padding: 0.8rem; border: 1px solid #ced4da; border-radius: 8px; font-size: 1rem; min-width: 300px; }
    .stock-button { padding: 0.8rem 1.5rem; border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; margin-left: 0.5rem; }
    .filter-btn { background-color: #6c757d; }
    .stock-table { width: 100%; border-collapse: collapse; }
    .stock-table th, .stock-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e9ecef; vertical-align: middle; }
    .stock-table th { background-color: #f8f9fa; }
    .action-btn { padding: 0.6rem 1.2rem; border-radius: 6px; border: none; color: white; cursor: pointer; font-weight: 600; }
    .edit-btn { background-color: #007bff; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); }
    .modal-content { background-color: white; padding: 2rem; border-radius: 12px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); position: relative; width: 90%; max-width: 500px; animation: fadeIn 0.3s ease-out; }
    .modal-close-btn { position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 2rem; color: #aaa; cursor: pointer; line-height: 1; }
    .modal-close-btn:hover { color: #333; }
    .modal-body h2 { margin-top: 0; color: #333; }
    .modal-med-name { color: #ff5e62; margin-top: -10px; margin-bottom: 20px; }
    .modal-form-group { margin: 1.5rem 0; }
    .modal-form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
    .modal-input { width: 100%; padding: 0.8rem; border: 1px solid #ced4da; border-radius: 8px; font-size: 1rem; box-sizing: border-box; }
    .modal-save-btn { width: 100%; padding: 1rem; border: none; border-radius: 8px; background: linear-gradient(90deg, #ff9966 0%, #ff5e62 100%); color: white; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
    .modal-save-btn:hover { transform: translateY(-2px); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    .modal-error { color: #dc3545; font-size: 0.9rem; margin-top: 1rem; }
  `;
  return <style>{styles}</style>;
};

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
        ? `http://localhost:3000/api/medicamentos/buscar?nombre=${query}`
        : 'http://localhost:3000/api/medicamentos';
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
    setModalError(''); // Limpia errores anteriores
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedicamento(null);
  };

  const handleUpdateStock = async () => {
    // ✅ CAMBIO: Validación para asegurar que el número sea positivo.
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
      <StockStyles />
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

