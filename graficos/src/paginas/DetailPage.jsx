// src/pages/DetailPage.jsx
import { useParams, Link } from "react-router-dom";
import "./DetailPage.css";

const statusColors = {
  running: "#0088FE",
  pending: "#00C49F",
  stopped: "#FFBB28",
};

const mockLists = {
  main: [
    { title: "Elemento A1", status: "running", group: "Grupo A" },
    { title: "Elemento A2", status: "pending", group: "Grupo A" },
    { title: "Elemento A3", status: "stopped", group: "Grupo A" },
  ],
  chart1: [
    { title: "Servicio 1 - Item 1", status: "running", group: "Servicio 1" },
    { title: "Servicio 1 - Item 2", status: "pending", group: "Servicio 1" },
  ],
  chart2: [
    { title: "Servicio 2 - Item 1", status: "stopped", group: "Servicio 2" },
    { title: "Servicio 2 - Item 2", status: "running", group: "Servicio 2" },
  ],
  chart3: [
    { title: "Servicio 3 - Item 1", status: "pending", group: "Servicio 3" },
    { title: "Servicio 3 - Item 2", status: "running", group: "Servicio 3" },
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

  // Ahora mismo no usamos sliceIndex para filtrar distinto por quesito,
  // pero podrías hacerlo fácilmente si lo necesitas.
  const list = mockLists[chartId] || [];

  return (
    <div className="detail-page">
      <div className="detail-page-inner">
        <Link to="/" className="back-link">
          &larr; Volver al panel
        </Link>

        <div className="detail-card">
          <div className="detail-card-header">
            <div>
              <h2>
                Detalle de {chartNames[chartId] || chartId} – Quesito{" "}
                {sliceIndex + 1}
              </h2>
              <p className="detail-subtitle">
                Elementos asociados al segmento seleccionado.
              </p>
            </div>
          </div>

          {list.length === 0 ? (
            <p className="empty-state">No hay elementos para este quesito.</p>
          ) : (
            <div className="items-table">
              <div className="items-header">
                <span>Título</span>
                <span>Estado</span>
                <span>Grupo</span>
                <span>Acciones</span>
              </div>

              {list.map((item, idx) => {
                const color = statusColors[item.status] || "#999999";
                const statusLabel =
                  item.status.charAt(0).toUpperCase() + item.status.slice(1);

                return (
                  <div className="item-row" key={idx}>
                    <span className="item-title">{item.title}</span>

                    <span className="item-status">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: color }}
                      />
                      <span>{statusLabel}</span>
                    </span>

                    <span className="item-group">{item.group}</span>

                    <span className="item-actions">
                      <button
                        className="edit-button"
                        onClick={() => console.log("Editar", item)}
                      >
                        Editar
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;