import React, { useEffect, useState } from "react";
import API from "../../src/backend/conexion.js";
import "./Ventas.css";

export default function Ventas() {
  const user = JSON.parse(localStorage.getItem("user"));
  const idSucursal = user?.idSucursal || 1;

  const [ventas, setVentas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalVenta, setTotalVenta] = useState(0);
  const registrosPorPagina = 15;

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  // === Obtener ventas ===
  const fetchVentas = async () => {
    try {
      const res = await API.get(`/ventas?idSucursal=${idSucursal}`);
      if (res.data.success) setVentas(res.data.data);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      mostrarMensaje("❌ Error al cargar ventas.");
    }
  };

  // === Obtener medicamentos ===
  const fetchMedicamentos = async () => {
    try {
      const res = await API.get(`/medicamentos/stock/${idSucursal}`);
      setMedicamentos(res.data);
    } catch (err) {
      console.error("Error al cargar medicamentos:", err);
      mostrarMensaje("❌ Error al cargar medicamentos.");
    }
  };

  useEffect(() => {
    fetchVentas();
    fetchMedicamentos();
  }, []);

  // === Filtrado por fechas ===
  const ventasFiltradas = ventas.filter((v) => {
    const fechaVenta = new Date(v.fecha);
    const desdeOk = fechaDesde ? fechaVenta >= new Date(fechaDesde + "T00:00:00") : true;
    const hastaOk = fechaHasta ? fechaVenta <= new Date(fechaHasta + "T23:59:59") : true;
    return desdeOk && hastaOk;
  });

  // === Paginación ===
  const totalPaginas = Math.ceil(ventasFiltradas.length / registrosPorPagina);
  const ventasPagina = ventasFiltradas.slice(
    (pagina - 1) * registrosPorPagina,
    pagina * registrosPorPagina
  );

  // === Agregar medicamento ===
  const agregarMedicamento = () => {
    if (!medicamentoSeleccionado || cantidad <= 0) {
      mostrarMensaje("⚠️ Selecciona un medicamento y cantidad válida.");
      return;
    }

    const med = medicamentos.find((m) => m.id === parseInt(medicamentoSeleccionado));
    if (!med) return;

    const nuevoProducto = {
      idMedicamento: med.id,
      nombre: med.nombre,
      cantidad,
      precioUnitario: parseFloat(med.precio),
      subtotal: cantidad * parseFloat(med.precio),
    };

    setProductos([...productos, nuevoProducto]);
    setMedicamentos(medicamentos.filter((m) => m.id !== med.id));
    setCantidad(1);
    setMedicamentoSeleccionado("");
  };

  // === Quitar medicamento ===
  const quitarMedicamento = (index) => {
    const prod = productos[index];
    setMedicamentos([...medicamentos, { id: prod.idMedicamento, nombre: prod.nombre, precio: prod.precioUnitario }]);
    setProductos(productos.filter((_, i) => i !== index));
  };

  // === Calcular total ===
  useEffect(() => {
    const total = productos.reduce((sum, p) => sum + (p.subtotal || 0), 0);
    setTotalVenta(total);
  }, [productos]);

  // === Registrar venta ===
  const registrarVenta = async () => {
    if (productos.length === 0) return mostrarMensaje("⚠️ Agrega al menos un medicamento.");

    try {
      const payload = {
        idUsuario: user.id,
        idSucursal: user.idSucursal,
        detalle: productos.map((p) => ({
          idMedicamento: p.idMedicamento,
          cantidad: p.cantidad,
          precioUnitario: p.precioUnitario,
          subtotal: p.subtotal,
        })),
      };

      const res = await API.post("/ventas", payload);
      if (res.data.success) {
        mostrarMensaje("✅ Venta registrada correctamente.");
        setModalAbierto(false);
        setProductos([]);
        fetchVentas();
        fetchMedicamentos();
      } else {
        mostrarMensaje("❌ No se pudo registrar la venta.");
      }
    } catch (err) {
      console.error("Error al registrar venta:", err);
      mostrarMensaje("❌ Error al registrar venta.");
    }
  };

  // === Estado para registro dinámico ===
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);

  return (
    <div className="ventas-container">
      <h2>🧾 Registro de Ventas</h2>

      {/* Filtros */}
      <div className="filtros">
        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        <button onClick={() => setModalAbierto(true)} className="btn-registrar">Registrar Venta</button>
      </div>

      {mensaje && <div className="toast">{mensaje}</div>}

      {/* Tabla Ventas */}
      <table className="tabla-ventas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Usuario</th>
            <th>Sucursal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {ventasPagina.map((v) => (
            <tr key={v.idVenta}>
              <td>{v.idVenta}</td>
              <td>{new Date(v.fecha).toLocaleDateString()}</td>
              <td>S/ {v.total.toFixed(2)}</td>
              <td>{v.usuario}</td>
              <td>{v.sucursal}</td>
              <td>
                <button onClick={() => setModalDetalle(v)} className="btn-detalle">Detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="paginacion">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button key={i} onClick={() => setPagina(i + 1)} className={i + 1 === pagina ? "pagina-activa" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal Registrar Venta */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal modal-grande" onClick={(e) => e.stopPropagation()}>
            <h3>Registrar Venta</h3>

            <div className="registro-inputs">
              <select
                value={medicamentoSeleccionado}
                onChange={(e) => setMedicamentoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione Medicamento</option>
                {medicamentos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} — S/ {m.precio}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={cantidad}
                min="1"
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                placeholder="Cantidad"
              />

              <button onClick={agregarMedicamento} className="btn-agregar">Agregar</button>
            </div>

            <table className="tabla-productos">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => (
                  <tr key={i}>
                    <td>{p.nombre}</td>
                    <td>{p.cantidad}</td>
                    <td>S/ {p.precioUnitario.toFixed(2)}</td>
                    <td>S/ {p.subtotal.toFixed(2)}</td>
                    <td><button className="btn-eliminar" onClick={() => quitarMedicamento(i)}>✖</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="total-venta">
              <strong>Total:</strong> S/ {totalVenta.toFixed(2)}
            </div>

            <div className="modal-buttons">
              <button onClick={registrarVenta} className="btn-guardar">Registrar</button>
              <button onClick={() => setModalAbierto(false)} className="btn-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Venta */}
      {modalDetalle && (
        <div className="modal-overlay" onClick={() => setModalDetalle(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Detalle de Venta #{modalDetalle.idVenta}</h3>
            <table className="tabla-detalle">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {modalDetalle.detalle.map((d, i) => (
                  <tr key={i}>
                    <td>{d.medicamento}</td>
                    <td>{d.cantidad}</td>
                    <td>S/ {d.precioUnitario}</td>
                    <td>S/ {d.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setModalDetalle(null)} className="btn-cancelar">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
