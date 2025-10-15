import { useState, useEffect } from "react";
import API from "../../backend/conexion.js";
import "./Medicamento.css"


function RegistroMedicamento() {
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
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [toast, setToast] = useState(""); // mensaje toast

  // 🔹 Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medRes, tiposRes, labsRes] = await Promise.all([
          API.get("/medicamentos"),
          API.get("/tipoMedicamentos"),
          API.get("/laboratorios"),
        ]);
        setMedicamentos(medRes.data);
        setTipos(tiposRes.data);
        setLaboratorios(labsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Manejo de inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Registro medicamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/medicamentos", form);

      // Actualizar lista
      const res = await API.get("/medicamentos");
      setMedicamentos(res.data);

      // Reset y cerrar modal
      setForm({
        nombre: "",
        precio: "",
        stock: "",
        idTipoMedicamento: "",
        idLaboratorio: "",
      });
      setShowModal(false);

      // Mostrar toast
      setToast("✅ Medicamento registrado");
      setTimeout(() => setToast(""), 3000); // desaparece en 3s
    } catch (err) {
      console.error(err);
      setToast("❌ Error al registrar medicamento");
      setTimeout(() => setToast(""), 3000);
    }
  };

  // 🔹 Filtro y paginación
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
      {toast && <div className="toast">{toast}</div>} {/* 🔹 TOAST */}

      <div className="header">
        <h2>Lista de Medicamentos</h2>
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
          </tr>
        </thead>
        <tbody>
          {currentMedicamentos.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.precio}</td>
              <td>{m.stock}</td>
              <td>{m.tipoMedicamento}</td>
              <td>{m.laboratorio}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Paginación */}
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

      {/* 🔹 Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Registrar Medicamento</h3>
            <form onSubmit={handleSubmit}>
              <label>Nombre:</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required />

              <label>Precio:</label>
              <input
                name="precio"
                type="number"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                required
              />

              <label>Stock:</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
              />

              <label>Tipo de Medicamento:</label>
              <select
                name="idTipoMedicamento"
                value={form.idTipoMedicamento}
                onChange={handleChange}
                required
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
              >
                <option value="">Seleccione...</option>
                {laboratorios.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.descripcion}
                  </option>
                ))}
              </select>

              <div className="modal-buttons">
                <button type="submit" className="btn-guardar">
                  Guardar
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
    </div>
  );
}

export default RegistroMedicamento;