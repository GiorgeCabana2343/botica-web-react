import React, { useEffect, useState } from "react";
import API from "../../src/backend/conexion.js";
import "./Reportes.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Reportes() {
  const user = JSON.parse(localStorage.getItem("user"));
  const idSucursal = user?.idSucursal || 1;

  const [kpis, setKpis] = useState({ numeroVentas: 0, ventasTotales: 0 });
  const [ventasDiaData, setVentasDiaData] = useState(null);
  const [ventasMedData, setVentasMedData] = useState(null);
  const [stockBajo, setStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);

  const optionsVentasDia = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Ventas de los Últimos 30 Días" },
    },
    scales: { 
        y: {
            beginAtZero: true
        }
    }
  };

  const optionsVentasMed = {
    indexAxis: 'y', 
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: false }, 
      title: { display: true, text: "Top 10 Medicamentos Más Vendidos" },
    },
     scales: { 
        x: {
            beginAtZero: true
        }
    }
  };

  useEffect(() => {
    if (!idSucursal) {
        setLoading(false); 
        console.error("No se encontró idSucursal");
        return;
    }


    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          resKpis,
          resVentasDia,
          resVentasMed,
          resStockBajo,
        ] = await Promise.all([
          API.get(`/reportes/kpis?idSucursal=${idSucursal}`),
          API.get(`/reportes/ventas-dia?idSucursal=${idSucursal}`),
          API.get(`/reportes/ventas-medicamento?idSucursal=${idSucursal}`),
          API.get(`/reportes/stock-bajo?idSucursal=${idSucursal}`),
        ]);

        setKpis(resKpis.data || { numeroVentas: 0, ventasTotales: 0 });

        if (resVentasDia.data && Array.isArray(resVentasDia.data)) {
            setVentasDiaData({
                labels: resVentasDia.data.map(d => new Date(d.dia).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit'})), // Formato DD/MM
                datasets: [
                {
                    label: "Total Vendido (S/)",
                    data: resVentasDia.data.map(d => d.totalVendido),
                    backgroundColor: "rgba(76, 110, 245, 0.7)", 
                    borderColor: "rgba(76, 110, 245, 1)", 
                    borderWidth: 1,
                },
                ],
            });
        } else {
             setVentasDiaData(null); 
        }

         if (resVentasMed.data && Array.isArray(resVentasMed.data)) {
            setVentasMedData({
                labels: resVentasMed.data.map(d => d.nombre),
                datasets: [
                {
                    label: "Cantidad Vendida",
                    data: resVentasMed.data.map(d => d.totalVendido), 
                    backgroundColor: "rgba(34, 184, 207, 0.7)", 
                    borderColor: "rgba(34, 184, 207, 1)", 
                    borderWidth: 1,
                },
                ],
            });
         } else {
              setVentasMedData(null);
         }


        setStockBajo(resStockBajo.data || []);

      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [idSucursal]);

  if (loading) {
    return <div className="reportes-container"><h2 className="reportes-titulo">Cargando reportes...</h2></div>;
  }

  return (
    <div className="reportes-container">
      <h2 className="reportes-titulo">📊 Panel de Reportes</h2>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Ventas Totales</h4>
          <p>S/ {(kpis.ventasTotales || 0).toFixed(2)}</p>
        </div>
        <div className="kpi-card">
          <h4>Número de Ventas</h4>
          <p>{kpis.numeroVentas || 0}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Ventas Recientes</h3>
          {ventasDiaData ? (
             <div style={{ height: '300px', position: 'relative' }}>
                <Bar options={optionsVentasDia} data={ventasDiaData} />
            </div>
          ) : <p>No hay datos de ventas diarias.</p>}
        </div>
        <div className="chart-container">
           <h3>Top Medicamentos</h3>
          {ventasMedData ? (
             <div style={{ height: '300px', position: 'relative' }}>
                <Bar options={optionsVentasMed} data={ventasMedData} />
            </div>
          ) : <p>No hay datos de medicamentos más vendidos.</p>}
        </div>
      </div>

      <div className="alerts-container">
        <h3>🚨 Alertas de Stock Bajo (Menos de 10)</h3>
        {stockBajo.length > 0 ? (
          <table className="tabla-alertas">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Stock Actual</th>
              </tr>
            </thead>
            <tbody>
              {stockBajo.map((item) => (
                <tr key={item.idMedicamento}>
                  <td data-label="Medicamento">{item.nombre}</td>
                  <td data-label="Stock Actual">{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>¡Todo bien! No hay medicamentos con stock bajo.</p>
        )}
      </div>
    </div>
  );
}