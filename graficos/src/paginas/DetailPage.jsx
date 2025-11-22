// src/pages/DetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./DetailPage.css";
import { fetchInstances } from "../api/client";
import { STATUS_COLORS } from "../config/cloudConstants";

const DetailPage = () => {
  const { mode, provider, status } = useParams();
  // mode: "provider" | "status"
  // provider: "aws" | "gcp" | "clouding"
  // status: "pending" | "running" | ...

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const allInstances = await fetchInstances();

        let filtered = allInstances;

        if (mode === "provider" && provider) {
          filtered = filtered.filter(
            (i) => (i.provider || "").toLowerCase() === provider.toLowerCase()
          );
        }

        if (mode === "status" && provider && status) {
          filtered = filtered.filter(
            (i) =>
              (i.provider || "").toLowerCase() === provider.toLowerCase() &&
              (i.status || "").toLowerCase() === status.toLowerCase()
          );
        }

        setItems(filtered);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [mode, provider, status]);

  const getTitle = () => {
    if (mode === "provider") {
      return `Instancias en ${provider?.toUpperCase()}`;
    }
    if (mode === "status") {
      return `Instancias ${status} en ${provider?.toUpperCase()}`;
    }
    return "Detalle";
  };

  return (
    <div className="detail-page">
      <div className="detail-page-inner">
        <div className="detail-top-bar">
          <Link to="/" className="back-link">
            &larr; Volver al panel
          </Link>

          <button
            className="create-button"
            onClick={() => {}}
          >
            + Crear instancia
          </button>
        </div>
        <div className="detail-card">
          <div className="detail-card-header">
            <div>
              <h2>{getTitle()}</h2>
              <p className="detail-subtitle">
                Lista de instancias según el segmento seleccionado.
              </p>
            </div>
          </div>

          {loading && <p className="empty-state">Cargando instancias...</p>}

          {error && !loading && (
            <p className="empty-state">Error: {error}</p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="empty-state">
              No hay instancias que cumplan este filtro.
            </p>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="items-table">
              <div className="items-header">
                <span>Nombre / CPU</span>
                <span>Proveedor / Memoria (GB)</span>
                <span>Estado</span>
                <span>Región</span>
                <span>Acciones</span>
              </div>
              {items.map((inst) => {
                const statusKey = (inst.status || "").toLowerCase();
                const color = STATUS_COLORS[statusKey] || "#999999";
                const statusLabel =
                  inst.status?.charAt(0).toUpperCase() +
                    inst.status?.slice(1) || "Sin estado";

                return (
                  <div className="item-row" key={inst.id}>
                    {/* Nombre - CPU */}
                    <span className="item-title">
                      {inst.name || "-"} - {inst.cpu_cores ?? "-"}
                    </span>

                    {/* Proveedor - Memoria */}
                    <span>
                      {(inst.provider || "-").toUpperCase()} - {inst.memory_gb ?? "-"}
                    </span>

                    {/* Estado */}
                    <span className="item-status">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: color }}
                      />
                      <span>{statusLabel}</span>
                    </span>

                    {/* Región */}
                    <span>{inst.region || "-"}</span>

                    {/* Botón editar (de momento sin lógica) */}
                    <span className="item-actions">
                      <button
                        className="edit-button"
                        onClick={() => {}}
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
