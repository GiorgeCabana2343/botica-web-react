import { useState, useEffect } from "react";
import API from "../../backend/conexion.js";
import "./Medicamento.css";
// import { useAuth } from "../../context/AuthContext.js";

function RegistroMedicamento() {
  const user = JSON.parse(localStorage.getItem("user"));
  const idSucursal = user?.idSucursal;
  const [medicamentos, setMedicamentos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    idTipoMedicamento: "",
    idLaboratorio: "",
    status: true,
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [toast, setToast] = useState("");

  const fetchData = async () => {
    if (!idSucursal) return;
    try {
      const [medRes, tiposRes, labsRes] = await Promise.all([
        API.get(`/medicamentos/ignoreStock/${idSucursal}`),
        API.get("/tipoMedicamentos/activos"),
        API.get("/laboratorios/activos"),
      ]);

      setMedicamentos(medRes.data);
      setTipos(tiposRes.data);
      setLaboratorios(labsRes.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setToast("❌ Error al cargar datos");
      setTimeout(() => setToast(""), 3000);
    }
  };

  useEffect(() => {
    if (idSucursal) {
      fetchData();
    } else {
      setToast("⚠️ No se detectó sucursal del usuario");
      setTimeout(() => setToast(""), 3000);
    }
  }, [idSucursal]);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await API.patch(`/medicamentos/status/${id}`, { status: newStatus });
      setMedicamentos(medicamentos.map(med =>
        med.id === id ? { ...med, status: newStatus } : med
      ));
      setToast("✅ Estado actualizado");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setToast("❌ Error al cambiar el estado");
      setTimeout(() => setToast(""), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.idSucursal) {
      setToast("⚠️ No se ha detectado la sucursal del usuario");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    if (!form.nombre || !form.precio || !form.stock || !form.idTipoMedicamento || !form.idLaboratorio) {
      setToast("⚠️ Por favor complete todos los campos");
      setTimeout(() => setToast(""), 3000);
      return;
    }


    try {
      const payload = {
        nombre: form.nombre,
        precio: Number(form.precio),
        idTipoMedicamento: Number(form.idTipoMedicamento),
        idLaboratorio: Number(form.idLaboratorio),
        stock: Number(form.stock),
        idSucursal: user.idSucursal,
        status: form.status ? 1 : 0,
      };

      await API.post("/medicamentos", payload);

      fetchData();
      setForm({
        nombre: "",
        precio: "",
        stock: "",
        idTipoMedicamento: "",
        idLaboratorio: "",
        status: true,
      });
      setShowModal(false);
      setToast("✅ Medicamento registrado correctamente");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.error("❌ Error al registrar medicamento:", err);
      const errorMsg = err.response?.data?.message || "No se pudo registrar el medicamento";
      setToast(`❌ ${errorMsg}`);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const filtered = medicamentos.filter((m) =>
    m.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMedicamentos = filtered.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="registro-container">
      {toast && <div className="toast">{toast}</div>}
      <div className="header">
        <h1>Lista de Medicamentos</h1>
        <button className="btn-registrar" onClick={() => setShowModal(true)}>
          ➕ Registrar Medicamento
        </button>
      </div>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="filtro-input"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
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
                <td data-label="Precio">S/ {Number(m.precio).toFixed(2)}</td>
                <td data-label="Stock">{m.stock}</td>
                <td data-label="Tipo">{m.tipoMedicamento}</td>
                <td data-label="Laboratorio">{m.laboratorio}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={m.status === 1}
                      onChange={() => handleStatusChange(m.id, m.status)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px', display: 'block'}}>
                No se encontraron medicamentos {search ? `con el nombre "${search}"` : ''}.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>◀</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>▶</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Registrar Medicamento</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="nombre">Nombre:</label>
              <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />

              <label htmlFor="precio">Precio:</label>
              <input id="precio" name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required />

              <label htmlFor="stock">Stock Inicial:</label>
              <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />

              <label htmlFor="idTipoMedicamento">Tipo de Medicamento:</label>
              <select id="idTipoMedicamento" name="idTipoMedicamento" value={form.idTipoMedicamento} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                {tipos.map((t) => (<option key={t.id} value={t.id}>{t.descripcion}</option>))}
              </select>

              <label htmlFor="idLaboratorio">Laboratorio:</label>
              <select id="idLaboratorio" name="idLaboratorio" value={form.idLaboratorio} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                {laboratorios.map((l) => (<option key={l.id} value={l.id}>{l.descripcion}</option>))}
              </select>

              <div className="modal-buttons">
                <button type="submit" className="btn-guardar">Guardar</button>
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroMedicamento;