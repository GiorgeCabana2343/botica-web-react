import { useState, useEffect } from "react";
import API from "../../backend/conexion.js";
import "./ActualizarMedicamento.css";

function ActualizarMedicamento() {
  const user = JSON.parse(localStorage.getItem("user"));
  const idSucursal = user?.idSucursal || 1;
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

  const [toastMessage, setToastMessage] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meds, tiposRes, labsRes] = await Promise.all([
          API.get(`/medicamentos/ignoreStock/${idSucursal}`),
          API.get("/tipoMedicamentos/activos"),
          API.get("/laboratorios/activos"),
        ]);
        setMedicamentos(meds.data);
        setTipos(tiposRes.data);
        setLaboratorios(labsRes.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setToastMessage("❌ Error al cargar datos");
        setTimeout(() => setToastMessage(""), 3000);
      }
    };
    fetchData();
  }, [idSucursal]); 

  const filteredMedicamentos = medicamentos.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMedicamentos = filteredMedicamentos.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleOpenModal = (med) => {
    setSelectedMedicamento(med);
    const tipoEncontrado = tipos.find((t) => t.descripcion === med.tipoMedicamento);
    const labEncontrado = laboratorios.find((l) => l.descripcion === med.laboratorio);

    setForm({
      nombre: med.nombre,
      precio: med.precio,
      idTipoMedicamento: tipoEncontrado ? tipoEncontrado.id : "",
      idLaboratorio: labEncontrado ? labEncontrado.id : "",
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedMedicamento) return;

    if (!form.nombre || !form.precio || !form.idTipoMedicamento || !form.idLaboratorio) {
      setToastMessage("⚠️ Por favor complete todos los campos");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }


    try {
      const payload = {
        nombre: form.nombre,
        precio: Number(form.precio),
        idTipoMedicamento: Number(form.idTipoMedicamento),
        idLaboratorio: Number(form.idLaboratorio)
      };
      await API.put(`/medicamentos/${selectedMedicamento.id}`, payload);
      const res = await API.get(`/medicamentos/ignoreStock/${idSucursal}`);
      setMedicamentos(res.data);
      setShowModal(false);
      setToastMessage("✅ Medicamento actualizado");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Error actualizando medicamento:", err);
      const errorMsg = err.response?.data?.message || "No se pudo actualizar el medicamento";
      setToastMessage(`❌ ${errorMsg}`);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <div className="actualizar-container">
      {toastMessage && <div className={`toast ${toastMessage ? 'show' : ''}`}>{toastMessage}</div>}

      <div className="header">
        <h1>Actualizar Medicamentos</h1>
      </div>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filtro}
        onChange={(e) => {
          setFiltro(e.target.value);
          setCurrentPage(1);
        }}
        className="filtro-input"
      />

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
                <td data-label="ID">{m.id}</td>
                <td data-label="Nombre">{m.nombre}</td>
                <td data-label="Precio (S/)">{Number(m.precio).toFixed(2)}</td>
                <td data-label="Tipo">{m.tipoMedicamento}</td>
                <td data-label="Laboratorio">{m.laboratorio}</td>
                <td>
                  <button className="btn-actualizar" onClick={() => handleOpenModal(m)}>
                    ✏️ Actualizar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="sin-resultados" style={{ display: 'block' }}>
                No hay medicamentos para mostrar {filtro ? `con el nombre "${filtro}"` : ''}.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 0 && ( 
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            ◀
          </button>
          <span>Página {currentPage} de {totalPages || 1}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
            ▶
          </button>
        </div>
      )}


      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Actualizar Medicamento</h3>
            <form onSubmit={handleUpdate}>
              <label htmlFor="nombre-modal">Nombre:</label>
              <input id="nombre-modal" name="nombre" value={form.nombre} onChange={handleChange} required className="input-corto" />

              <label htmlFor="precio-modal">Precio (S/):</label>
              <input id="precio-modal" name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required className="input-corto" />

              <label htmlFor="tipo-modal">Tipo de Medicamento:</label>
              <select id="tipo-modal" name="idTipoMedicamento" value={form.idTipoMedicamento} onChange={handleChange} required className="input-corto">
                <option value="">Seleccione...</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>{t.descripcion}</option>
                ))}
              </select>

              <label htmlFor="lab-modal">Laboratorio:</label>
              <select id="lab-modal" name="idLaboratorio" value={form.idLaboratorio} onChange={handleChange} required className="input-corto">
                <option value="">Seleccione...</option>
                {laboratorios.map((l) => (
                  <option key={l.id} value={l.id}>{l.descripcion}</option>
                ))}
              </select>

              <div className="modal-botones">
                <button type="submit" className="btn-guardar">Guardar Cambios</button>
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActualizarMedicamento;