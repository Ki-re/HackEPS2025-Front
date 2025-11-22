// src/pages/DetailPage.jsx
import { useParams, Link } from "react-router-dom";

const mockLists = {
  main: [
    ["Elemento A1", "Elemento A2", "Elemento A3"],
    ["Elemento B1", "Elemento B2"],
    ["Elemento C1"],
    ["Elemento D1", "Elemento D2", "Elemento D3", "Elemento D4"],
  ],
  chart1: [
    ["UNO-1", "UNO-2"],
    ["DOS-1", "DOS-2", "DOS-3"],
    ["TRES-1"],
  ],
  chart2: [
    ["X-1", "X-2"],
    ["Y-1"],
    ["Z-1", "Z-2"],
  ],
  chart3: [
    ["Rojo-1"],
    ["Verde-1", "Verde-2"],
    ["Azul-1", "Azul-2", "Azul-3"],
  ],
};

const chartNames = {
  main: "Gráfico principal",
  chart1: "Gráfico pequeño 1",
  chart2: "Gráfico pequeño 2",
  chart3: "Gráfico pequeño 3",
};

const DetailPage = () => {
  const { chartId, sliceId } = useParams();
  const sliceIndex = Number(sliceId);

  const list =
    mockLists[chartId] && mockLists[chartId][sliceIndex]
      ? mockLists[chartId][sliceIndex]
      : [];

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <Link to="/">&larr; Volver al panel</Link>

      <h2>
        Detalle de {chartNames[chartId] || chartId} – Quesito {sliceIndex + 1}
      </h2>

      {list.length === 0 ? (
        <p>No hay elementos para este quesito.</p>
      ) : (
        <ul>
          {list.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DetailPage;
