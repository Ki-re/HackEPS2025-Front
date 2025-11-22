// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css"; // opcional

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

// Datos de ejemplo
const mainChartData = [
  { name: "Grupo A", value: 400 },
  { name: "Grupo B", value: 300 },
  { name: "Grupo C", value: 300 },
];

const smallChart1Data = [
  { name: "Running", value: 100 },
  { name: "Pending", value: 200 },
  { name: "Stopped", value: 50 },
];

const smallChart2Data = [
  { name: "Running", value: 150 },
  { name: "Pending", value: 80 },
  { name: "Stopped", value: 120 },
];

const smallChart3Data = [
  { name: "Running", value: 90 },
  { name: "Pending", value: 60 },
  { name: "Stopped", value: 110 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSliceClick = (chartId, sliceIndex) => {
    navigate(`/detalle/${chartId}/${sliceIndex}`);
  };

// ya no hace falta importar Legend desde "recharts"
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
        cy="50%"                 // fuerza el centro geométrico
        outerRadius={isMain ? 190 : 50}
        onClick={(_, index) => handleSliceClick(chartId, index)}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            style={{ cursor: "pointer" }}
          />
        ))}
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

          {/* Leyenda del principal con el mismo estilo flex */}
          <div className="main-chart-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: COLORS[0] }} />
              <span>Grupo A</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: COLORS[1] }} />
              <span>Grupo B</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: COLORS[2] }} />
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
              {renderPie(smallChart1Data, "chart1")}
            </div>
          </div>

          <div className="small-chart-block">
            <h3 className="small-chart-title">Servicio 2</h3>
            <div className="small-chart">
              {renderPie(smallChart2Data, "chart2")}
            </div>
          </div>

          <div className="small-chart-block">
            <h3 className="small-chart-title">Servicio 3</h3>
            <div className="small-chart">
              {renderPie(smallChart3Data, "chart3")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
