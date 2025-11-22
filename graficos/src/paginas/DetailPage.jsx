import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./DetailPage.css";
import { fetchInstances } from "../api/client";
import { STATUS_COLORS } from "../config/cloudConstants";

const NO_CLUSTER_KEY = "no-cluster";

const DetailPage = () => {
  const { mode, provider, status } = useParams();

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
        } else if (mode === "status" && provider && status) {
          filtered = filtered.filter(
            (i) =>
              (i.provider || "").toLowerCase() === provider.toLowerCase() &&
              (i.status || "").toLowerCase() === status.toLowerCase()
          );
        } else if (mode === "cluster" && provider) {
          filtered = filtered.filter((i) => {
            const clusterKey =
              i.cluster_id == null ? NO_CLUSTER_KEY : String(i.cluster_id);
            return clusterKey === provider;
          });
        } else if (mode === "cluster-status" && provider && status) {
          filtered = filtered.filter((i) => {
            const clusterKey =
              i.cluster_id == null ? NO_CLUSTER_KEY : String(i.cluster_id);
            return (
              clusterKey === provider &&
              (i.status || "").toLowerCase() === status.toLowerCase()
            );
          });
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
      const s = status || "";
      const label = s.charAt(0).toUpperCase() + s.slice(1);
      return `Instancias ${label} en ${provider?.toUpperCase()}`;
    }
    if (mode === "cluster") {
      if (!provider || provider === NO_CLUSTER_KEY) {
        return "Instancias sin cluster";
      }
      return `Instancias del cluster ${provider}`;
    }
    if (mode === "cluster-status") {
      const s = status || "";
      const label = s.charAt(0).toUpperCase() + s.slice(1);
      if (!provider || provider === NO_CLUSTER_KEY) {
        return `Instancias ${label} sin cluster`;
      }
      return `Instancias ${label} del cluster ${provider}`;
    }
    return "Detalle";
  };

  return (
    <div className="detail-page">
      <div className="detail-page-inner">
        <Link to="/" className="back-link">
          &larr; Volver al panel
        </Link>

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
                <span>Nombre</span>
                <span>CPU</span>
                <span>Proveedor</span>
                <span>Memoria (GB)</span>
                <span>Estado</span>
                <span>Región</span>
                <span>Cluster</span>
              </div>

              {items.map((inst) => {
                const statusKey = (inst.status || "").toLowerCase();
                const color = STATUS_COLORS[statusKey] || "#999999";
                const statusLabel =
                  inst.status && inst.status.length > 0
                    ? inst.status.charAt(0).toUpperCase() +
                      inst.status.slice(1)
                    : "Sin estado";
                const clusterLabel =
                  inst.cluster_id == null ? "Sin cluster" : inst.cluster_id;

                return (
                  <div className="item-row" key={inst.id}>
                    <span className="item-title">
                      {inst.name || "-"}
                    </span>

                    <span>
                      {inst.cpu_cores ?? "-"}
                    </span>

                    <span>
                      {(inst.provider || "-").toUpperCase()}
                    </span>

                    <span>
                      {inst.memory_gb ?? "-"}
                    </span>

                    <span className="item-status">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: color }}
                      />
                      <span>{statusLabel}</span>
                    </span>

                    <span>{inst.region || "-"}</span>

                    <span>{clusterLabel}</span>
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
