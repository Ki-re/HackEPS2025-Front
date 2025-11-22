// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css"; // opcional

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Datos de ejemplo
const mainChartData = [
  { name: "Grupo A", value: 400 },
  { name: "Grupo B", value: 300 },
  { name: "Grupo C", value: 300 },
  { name: "Grupo D", value: 200 },
];

const smallChart1Data = [
  { name: "UNO", value: 100 },
  { name: "DOS", value: 200 },
  { name: "TRES", value: 50 },
];

const smallChart2Data = [
  { name: "X", value: 150 },
  { name: "Y", value: 80 },
  { name: "Z", value: 120 },
];

const smallChart3Data = [
  { name: "Rojo", value: 90 },
  { name: "Verde", value: 60 },
  { name: "Azul", value: 110 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSliceClick = (chartId, sliceIndex) => {
    // chartId: identificador del gráfico (main, chart1, chart2, chart3)
    // sliceIndex: índice del quesito clicado
    navigate(`/detalle/${chartId}/${sliceIndex}`);
  };

  const renderPie = (data, chartId, isMain = false) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={isMain ? 120 : 60}
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="dashboard-container">
      <h1>Panel de gráficos</h1>

      {/* Gráfico principal */}
      <div className="main-chart">
        {renderPie(mainChartData, "main", true)}
      </div>

      {/* Tres gráficos pequeños abajo */}
      <div className="small-charts-row">
        <div className="small-chart">
          {renderPie(smallChart1Data, "chart1")}
        </div>
        <div className="small-chart">
          {renderPie(smallChart2Data, "chart2")}
        </div>
        <div className="small-chart">
          {renderPie(smallChart3Data, "chart3")}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
