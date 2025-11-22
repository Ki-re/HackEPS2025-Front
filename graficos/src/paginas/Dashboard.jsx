// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

// Colores para el gráfico principal (Grupos A–C)
const MAIN_COLORS = ["#63eaf1", "#63a8f1", "#6366f1"];

// Colores para los estados de los gráficos pequeños
const STATUS_COLORS = {
  Pending: "#f1de63",
  Running: "#63f1b1",
  Stopped: "#bdbcb5",
};

// Datos de ejemplo
const mainChartData = [
  { name: "Grupo A", value: 400 },
  { name: "Grupo B", value: 300 },
  { name: "Grupo C", value: 300 },
];

const smallChartData = [
  { name: "Running", value: 100 },
  { name: "Pending", value: 200 },
  { name: "Stopped", value: 50 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSliceClick = (chartId, sliceIndex) => {
    navigate(`/detalle/${chartId}/${sliceIndex}`);
  };

  // Render genérico de pastel
  const renderPie = (data, chartId, { isMain = false } = {}) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart
        margin={
          isMain
            ? { top: 0, right: 0, bottom: 0, left: 0 }
            : { top: 10, right: 10, bottom: 10, left: 10 }
        }
      >
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={isMain ? 190 : 50}
          onClick={(_, index) => handleSliceClick(chartId, index)}
        >
          {data.map((entry, index) => {
            const fillColor = isMain
              ? MAIN_COLORS[index % MAIN_COLORS.length] // principal
              : STATUS_COLORS[entry.name] || "#999999"; // pequeños por estado

            return (
              <Cell
                key={`cell-${index}`}
                fill={fillColor}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="dashboard-container">
      <div className="charts-row">
        {/* Izquierda: gráfico principal */}
        <div className="main-chart-card">
          <div className="main-chart-title">
            <h2 className="card-title">Estado general</h2>
          </div>

          <div className="main-chart">
            {renderPie(mainChartData, "main", { isMain: true })}
          </div>

          {/* Leyenda del principal con los mismos colores MAIN_COLORS */}
          <div className="main-chart-legend">
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: MAIN_COLORS[0] }}
              />
              <span>Grupo A</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: MAIN_COLORS[1] }}
              />
              <span>Grupo B</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: MAIN_COLORS[2] }}
              />
              <span>Grupo C</span>
            </div>
          </div>
        </div>

        {/* Derecha: 3 gráficos pequeños en columna */}
        <div className="small-charts-wrapper">
          <div className="small-charts-legend">
            <div className="legend-item">
              <span className="legend-color legend-pending" />
              <span>Pending</span>
            </div>
            <div className="legend-item">
              <span className="legend-color legend-running" />
              <span>Running</span>
            </div>
            <div className="legend-item">
              <span className="legend-color legend-stopped" />
              <span>Stopped</span>
            </div>
          </div>

          <div className="small-chart-block">
            <h3 className="small-chart-title">Servicio 1</h3>
            <div className="small-chart">
              {renderPie(smallChartData, "chart1")}
            </div>
          </div>

          <div className="small-chart-block">
            <h3 className="small-chart-title">Servicio 2</h3>
            <div className="small-chart">
              {renderPie(smallChartData, "chart2")}
            </div>
          </div>

          <div className="small-chart-block">
            <h3 className="small-chart-title">Servicio 3</h3>
            <div className="small-chart">
              {renderPie(smallChartData, "chart3")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
