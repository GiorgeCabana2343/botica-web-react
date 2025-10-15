import { useState, useEffect } from "react";
import API from "../../backend/conexion.js";
import "./ActualizarMedicamento.css";

function ActualizarMedicamento() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    idTipoMedicamento: "",
    idLaboratorio: "",
  });

  const [showToast, setShowToast] = useState(false);

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // 🧠 Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meds, tiposRes, labsRes] = await Promise.all([
          API.get("/medicamentos"),
          API.get("/tipoMedicamentos"),
          API.get("/laboratorios"),
        ]);
        setMedicamentos(meds.data);
        setTipos(tiposRes.data);
        setLaboratorios(labsRes.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, []);

  // 🔍 Filtrado
  const filteredMedicamentos = medicamentos.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // 🔹 Paginación lógica
  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMedicamentos = filteredMedicamentos.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // 🧾 Abrir modal con datos del medicamento seleccionado
  const handleOpenModal = (med) => {
    setSelectedMedicamento(med);

    // Buscar IDs correctos según la descripción (si no existen en el objeto)
    const tipoEncontrado = tipos.find((t) => t.descripcion === med.tipoMedicamento);
    const labEncontrado = laboratorios.find((l) => l.descripcion === med.laboratorio);

    setForm({
      nombre: med.nombre,
      precio: med.precio,
      idTipoMedicamento: med.idTipoMedicamento || (tipoEncontrado ? tipoEncontrado.id : ""),
      idLaboratorio: med.idLaboratorio || (labEncontrado ? labEncontrado.id : ""),
    });

    setShowModal(true);
  };

  // ✏️ Manejar cambios del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Actualizar medicamento
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/medicamentos/${selectedMedicamento.id}`, form);
      const res = await API.get("/medicamentos");
      setMedicamentos(res.data);
      setShowModal(false);

      // Mostrar toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Error actualizando medicamento:", err);
      alert("❌ No se pudo actualizar el medicamento");
    }
  };

  return (
    <div className="actualizar-container">
      <div className="header">
        <h2>Actualizar Medicamentos</h2>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-busqueda"
        />
      </div>

      {/* Tabla */}
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio (S/)</th>
            <th>Tipo</th>
            <th>Laboratorio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentMedicamentos.length > 0 ? (
            currentMedicamentos.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td>{m.precio}</td>
                <td>{m.tipoMedicamento}</td>
                <td>{m.laboratorio}</td>
                <td>
                  <button className="btn-actualizar" onClick={() => handleOpenModal(m)}>
                    ✏️ Actualizar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="sin-resultados">
                No hay medicamentos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          ◀
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          ▶
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Actualizar Medicamento</h3>
            <form onSubmit={handleUpdate}>
              <label>Nombre:</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="input-corto"
              />

              <label>Precio (S/):</label>
              <input
                name="precio"
                type="number"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                required
                className="input-corto"
              />

              <label>Tipo de Medicamento:</label>
              <select
                name="idTipoMedicamento"
                value={form.idTipoMedicamento}
                onChange={handleChange}
                required
                className="input-corto"
              >
                <option value="">Seleccione...</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.descripcion}
                  </option>
                ))}
              </select>

              <label>Laboratorio:</label>
              <select
                name="idLaboratorio"
                value={form.idLaboratorio}
                onChange={handleChange}
                required
                className="input-corto"
              >
                <option value="">Seleccione...</option>
                {laboratorios.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.descripcion}
                  </option>
                ))}
              </select>

              <div className="modal-botones">
                <button type="submit" className="btn-guardar">
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && <div className="toast show">✅ Medicamento actualizado</div>}
    </div>
  );
}

export default ActualizarMedicamento;