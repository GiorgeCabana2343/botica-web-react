import { useEffect, useState } from "react";
import API from "../../backend/conexion.js";
import "./TipoMedicamento.css";

function TipoMedicamento() {
  const [tipos, setTipos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nuevo, setNuevo] = useState({ descripcion: "" });
  const [showToast, setShowToast] = useState(false);

  // Cargar tipos de medicamento
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await API.get("/tipoMedicamentos");
        setTipos(res.data);
      } catch (err) {
        console.error("Error al cargar tipos:", err);
      }
    };
    fetchTipos();
  }, []);

  // Filtro en tiempo real
  const tiposFiltrados = tipos.filter((t) =>
    t.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  // Registrar nuevo tipo
  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tipoMedicamentos", nuevo);
      setShowModal(false);
      setNuevo({ descripcion: "" });

      const res = await API.get("/tipoMedicamentos");
      setTipos(res.data);

      // Mostrar toast
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

      {/* Tarjetas */}
      <div className="tarjetas-grid">
        {tiposFiltrados.length > 0 ? (
          tiposFiltrados.map((t) => (
            <div key={t.id} className="tarjeta">
              <span className="icono">💊</span>
              <p className="descripcion">{t.descripcion}</p>
            </div>
          ))
        ) : (
          <p className="sin-resultados">No hay tipos registrados</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-titulo">Registrar Tipo de Medicamento</h3>
            <form onSubmit={handleRegistrar}>
              <label>Descripción</label>
              <input
                type="text"
                placeholder="Ej: Antiinflamatorio"
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
      {showToast && <div className="toast show">Tipo registrado</div>}
    </div>
  );
}

export default TipoMedicamento;