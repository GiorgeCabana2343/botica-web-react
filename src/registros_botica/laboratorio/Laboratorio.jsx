import { useState, useEffect } from "react";
import API from "../../backend/conexion.js";
import "./Laboratorio.css";

function RegistroLaboratorio() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [nuevo, setNuevo] = useState({ descripcion: "", status: true });

  const [showToast, setShowToast] = useState(false);

  const fetchLaboratorios = async () => {
    try {
      const res = await API.get("/laboratorios");
      setLaboratorios(res.data);
    } catch (err) {
      console.error("Error al cargar laboratorios:", err);
    }
  };

  useEffect(() => {
    fetchLaboratorios();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await API.patch(`/laboratorios/status/${id}`, { status: newStatus });
      setLaboratorios(laboratorios.map(lab =>
        lab.id === id ? { ...lab, status: newStatus } : lab
      ));
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      alert("❌ Error al cambiar el estado del laboratorio");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const laboratoriosFiltrados = laboratorios.filter((l) =>
    l.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        descripcion: nuevo.descripcion,
        status: nuevo.status ? 1 : 0
      };
      await API.post("/laboratorios", payload);
      setShowModal(false);
      setNuevo({ descripcion: "", status: true });
      fetchLaboratorios();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Error al registrar laboratorio:", err);
      alert("❌ Error al registrar el laboratorio");
    }
  };

  return (
    <div className="tipo-container">
      <h1 className="titulo">Laboratorios</h1>
      <div className="acciones">
        <input
          type="text"
          placeholder="Buscar laboratorio..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-busqueda"
        />
        <button onClick={() => setShowModal(true)} className="btn-registrar">
          ➕ Registrar Laboratorio
        </button>
      </div>
      <div className="tarjetas-grid">
        {laboratoriosFiltrados.length > 0 ? (
          laboratoriosFiltrados.map((l) => (
            <div key={l.id} className="tarjeta">
              <div className="tarjeta-info">
                <span className="icono">🏢</span>
                <p className="descripcion">{l.descripcion}</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={l.status === 1}
                  onChange={() => handleStatusChange(l.id, l.status)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))
        ) : (
          <p className="sin-resultados">No hay laboratorios registrados</p>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-titulo">Registrar Laboratorio</h3>
            <form onSubmit={handleRegistrar}>
              <label>Descripción</label>
              <input
                type="text"
                name="descripcion"
                placeholder="Ej: Pfizer"
                value={nuevo.descripcion}
                onChange={handleChange}
                required
              />

              <div className="form-group-switch">
                <label>Activo:</label>
                <label className="switch">
                  <input
                    name="status"
                    type="checkbox"
                    checked={nuevo.status}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="modal-botones">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showToast && <div className="toast show"> ✅ Laboratorio registrado</div>}
    </div>
  );
}

export default RegistroLaboratorio;

