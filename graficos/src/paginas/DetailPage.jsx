import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./DetailPage.css";
import { fetchInstances } from "../api/client";
import { STATUS_COLORS } from "../config/cloudConstants";
import { useAuth } from "../contexts/AuthContext";

const NO_CLUSTER_KEY = "no-cluster";

const DetailPage = () => {
  const { mode, provider, status } = useParams();
  const { user } = useAuth();

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
      return `Instàncies a ${provider?.toUpperCase()}`;
    }
    if (mode === "status") {
      const s = status || "";
      const label = s.charAt(0).toUpperCase() + s.slice(1);
      return `Instàncies ${label} a ${provider?.toUpperCase()}`;
    }
    if (mode === "cluster") {
      if (!provider || provider === NO_CLUSTER_KEY) {
        return "Instàncies sense clúster";
      }
      // Try to find the cluster name for the title
      const sampleInstance = items.find((i) => String(i.cluster_id) === provider);
      const clusterDisplayName = sampleInstance?.cluster_name || `Clúster ${provider}`;
      return `Instàncies de ${clusterDisplayName}`;
    }
    if (mode === "cluster-status") {
      const s = status || "";
      const label = s.charAt(0).toUpperCase() + s.slice(1);
      if (!provider || provider === NO_CLUSTER_KEY) {
        return `Instàncies ${label} sense clúster`;
      }
      const sampleInstance = items.find((i) => String(i.cluster_id) === provider);
      const clusterDisplayName = sampleInstance?.cluster_name || `Clúster ${provider}`;
      return `Instàncies ${label} de ${clusterDisplayName}`;
    }
    return "Detall";
  };

  return (
    <div className="detail-page">
      <div className="detail-page-inner">
        <div className="detail-header">
          <Link to="/" className="back-link">
            &larr; Tornar al panell
          </Link>
          <span className="user-badge">
            {user?.username || "Usuari"}
          </span>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <div>
              <h2>{getTitle()}</h2>
              <p className="detail-subtitle">
                Llista d'instàncies segons el segment seleccionat.
              </p>
            </div>
          </div>

          {loading && <p className="empty-state">Carregant instàncies...</p>}

          {error && !loading && (
            <p className="empty-state">Error: {error}</p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="empty-state">
              No hi ha instàncies que compleixin aquest filtre.
            </p>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="items-table">
              <div className="items-header">
                <span>Nom</span>
                <span>CPU</span>
                <span>Proveïdor</span>
                <span>Memòria (GB)</span>
                <span>Estat</span>
                <span>Regió</span>
                <span>IP master</span>
                <span>Clúster</span>
              </div>

              {items.map((inst) => {
                const statusKey = (inst.status || "").toLowerCase();
                const color = STATUS_COLORS[statusKey] || "#999999";
                const statusLabel =
                  inst.status && inst.status.length > 0
                    ? inst.status.charAt(0).toUpperCase() +
                      inst.status.slice(1)
                    : "Sense estat";
                const clusterLabel =
                  inst.cluster_name || (inst.cluster_id ? `Clúster ${inst.cluster_id}` : "Sense clúster");
                const masterIp =
                  inst.external_ip || inst.internal_ip || "";
                const masterIpUrl = masterIp ? `http://${masterIp}` : null;

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

                    <span>
                      {masterIpUrl ? (
                        <a
                          href={masterIpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {masterIp}
                        </a>
                      ) : (
                        "-"
                      )}
                    </span>

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
