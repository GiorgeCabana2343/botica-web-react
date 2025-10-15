import { useState, useEffect } from "react";
import API from "../../backend/conexion.js";
import "./Laboratorio.css";

function RegistroLaboratorio() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nuevo, setNuevo] = useState({ descripcion: "" });
  const [showToast, setShowToast] = useState(false);

  // Cargar laboratorios
  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const res = await API.get("/laboratorios");
        setLaboratorios(res.data);
      } catch (err) {
        console.error("Error al cargar laboratorios:", err);
      }
    };
    fetchLaboratorios();
  }, []);

  // Filtrado en tiempo real
  const laboratoriosFiltrados = laboratorios.filter((l) =>
    l.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  // Registrar nuevo laboratorio
  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await API.post("/laboratorios", nuevo);
      setShowModal(false);
      setNuevo({ descripcion: "" });

      const res = await API.get("/laboratorios");
      setLaboratorios(res.data);

      // Mostrar toast
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

      {/* Tarjetas */}
      <div className="tarjetas-grid">
        {laboratoriosFiltrados.length > 0 ? (
          laboratoriosFiltrados.map((l) => (
            <div key={l.id} className="tarjeta">
              <span className="icono">🏢</span>
              <p className="descripcion">{l.descripcion}</p>
            </div>
          ))
        ) : (
          <p className="sin-resultados">No hay laboratorios registrados</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-titulo">Registrar Laboratorio</h3>
            <form onSubmit={handleRegistrar}>
              <label>Descripción</label>
              <input
                type="text"
                placeholder="Ej: Pfizer"
                value={nuevo.descripcion}
                onChange={(e) =>
                  setNuevo({ ...nuevo, descripcion: e.target.value })
                }
                required
              />
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

      {/* Toast */}
      {showToast && <div className="toast show">Laboratorio registrado</div>}
    </div>
  );
}

export default RegistroLaboratorio;