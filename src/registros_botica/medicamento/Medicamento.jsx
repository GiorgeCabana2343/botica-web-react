import { useState, useEffect } from "react";
import API from "../../backend/conexion.js";
import "./Medicamento.css";
// import { useAuth } from "../../context/AuthContext.js"; // Comentado en tu código original


function RegistroMedicamento() {
  const user = JSON.parse(localStorage.getItem("user"));
  const idSucursal = user?.idSucursal;
  //const { user } = useAuth();
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
    }
  };

  useEffect(() => {
    if (idSucursal) {
      fetchData();
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
      setTimeout(() => setToast(""), 5000);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setToast("❌ Error al cambiar el estado");
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
      return;
    }

    try {
      const payload = {
        nombre: form.nombre,
        precio: form.precio,
        idTipoMedicamento: form.idTipoMedicamento,
        idLaboratorio: form.idLaboratorio,
        stock: form.stock,
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
      setToast("❌ No se pudo registrar el medicamento");
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
          {currentMedicamentos.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>S/ {Number(m.precio).toFixed(2)}</td>
              <td>{m.stock}</td>
              <td>{m.tipoMedicamento}</td>
              <td>{m.laboratorio}</td>
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
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>◀</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>▶</button>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Registrar Medicamento</h3>
            <form onSubmit={handleSubmit}>
              <label>Nombre:</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required />
              <label>Precio:</label>
              <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required />
              <label>Stock:</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
              <label>Tipo de Medicamento:</label>
              <select name="idTipoMedicamento" value={form.idTipoMedicamento} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                {tipos.map((t) => (<option key={t.id} value={t.id}>{t.descripcion}</option>))}
              </select>
              <label>Laboratorio:</label>
              <select name="idLaboratorio" value={form.idLaboratorio} onChange={handleChange} required>
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