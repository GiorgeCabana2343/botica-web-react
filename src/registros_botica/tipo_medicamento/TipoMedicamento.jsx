import { useEffect, useState } from "react";
import API from "../../backend/conexion.js";
import "./TipoMedicamento.css";

function TipoMedicamento() {
  const [tipos, setTipos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nuevo, setNuevo] = useState({ descripcion: "", status: true });
  const [showToast, setShowToast] = useState(false);

  const fetchTipos = async () => {
    try {
      const res = await API.get("/tipoMedicamentos");
      setTipos(res.data);
    } catch (err) {
      console.error("Error al cargar tipos:", err);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await API.patch(`/tipoMedicamentos/status/${id}`, { status: newStatus });
      setTipos(tipos.map(t =>
        t.id === id ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      alert("❌ Error al cambiar el estado");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const tiposFiltrados = tipos.filter((t) =>
    t.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        descripcion: nuevo.descripcion,
        status: nuevo.status ? 1 : 0
      };
      await API.post("/tipoMedicamentos", payload);
      setShowModal(false);
      setNuevo({ descripcion: "", status: true });
      fetchTipos();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Error al registrar tipo:", err);
      alert("❌ Error al registrar el tipo de medicamento");
    }
  };

  return (
    <div className="tipo-container">
      <h1 className="titulo">Tipos de Medicamento</h1>

      <div className="acciones">
        <input
          type="text"
          placeholder="Buscar tipo de medicamento..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-busqueda"
        />
        <button onClick={() => setShowModal(true)} className="btn-registrar">
          ➕ Registrar Tipo
        </button>
      </div>

      <div className="tarjetas-grid">
        {tiposFiltrados.length > 0 ? (
          tiposFiltrados.map((t) => (
            <div key={t.id} className="tarjeta">
              <div className="tarjeta-info">
                <span className="icono">💊</span>
                <p className="descripcion">{t.descripcion}</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={t.status === 1}
                  onChange={() => handleStatusChange(t.id, t.status)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))
        ) : (
          <p className="sin-resultados">No hay tipos registrados</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-titulo">Registrar Tipo de Medicamento</h3>
            <form onSubmit={handleRegistrar}>
              <label>Descripción</label>
              <input
                type="text"
                name="descripcion" 
                placeholder="Ej: Antiinflamatorio"
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
      {showToast && <div className="toast show">✅ Tipo registrado</div>}
    </div>
  );
}

export default TipoMedicamento;