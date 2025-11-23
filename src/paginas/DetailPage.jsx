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
  const [clusterMasterData, setClusterMasterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getInstanceClusterKey = (inst) => {
    const id = inst.cluster_id ?? inst.clusterId ?? null;
    if (id == null || id === "") return NO_CLUSTER_KEY;
    return String(id);
  };

  const fetchClusterInfo = async (clusterKey) => {
    if (!clusterKey || clusterKey === NO_CLUSTER_KEY) return null;
    try {
      const res = await fetch(`/api/v1/clusters/${clusterKey}`);
      if (!res.ok) return null;
      const cluster = await res.json();
      const masterIp =
        cluster.network_config?.master_ip ||
        cluster.network_config?.masterIp ||
        cluster.master_ip ||
        cluster.masterIp ||
        null;
      const serviceUrl =
        cluster.network_config?.service_url ||
        cluster.network_config?.serviceUrl ||
        null;
      if (!masterIp && !serviceUrl) return null;
      let finalUrl = serviceUrl;
      if (!finalUrl && masterIp) {
        finalUrl = `http://${masterIp}`;
      }
      return {
        masterIp,
        serviceUrl: finalUrl,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setClusterMasterData({});

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
            const clusterKey = getInstanceClusterKey(i);
            return clusterKey === provider;
          });
        } else if (mode === "cluster-status" && provider && status) {
          filtered = filtered.filter((i) => {
            const clusterKey = getInstanceClusterKey(i);
            return (
              clusterKey === provider &&
              (i.status || "").toLowerCase() === status.toLowerCase()
            );
          });
        }

        setItems(filtered);

        const uniqueClusterKeys = Array.from(
          new Set(
            filtered
              .map((i) => getInstanceClusterKey(i))
              .filter((k) => k && k !== NO_CLUSTER_KEY)
          )
        );

        if (uniqueClusterKeys.length > 0) {
          const entries = await Promise.all(
            uniqueClusterKeys.map(async (clusterKey) => {
              const data = await fetchClusterInfo(clusterKey);
              return [clusterKey, data];
            })
          );
          const map = {};
          entries.forEach(([k, v]) => {
            map[k] = v;
          });
          setClusterMasterData(map);
        }
      } catch (err) {
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

  const getMasterUrlForInstance = (inst) => {
    const clusterKey = getInstanceClusterKey(inst);
    if (!clusterKey || clusterKey === NO_CLUSTER_KEY) return null;
    const data = clusterMasterData[clusterKey];
    if (!data) return null;
    return data.serviceUrl || null;
  };

  const getMasterLabelForInstance = (inst) => {
    const clusterKey = getInstanceClusterKey(inst);
    if (!clusterKey || clusterKey === NO_CLUSTER_KEY) return null;
    const data = clusterMasterData[clusterKey];
    if (!data) return null;
    if (data.masterIp) return data.masterIp;
    if (data.serviceUrl) {
      if (data.serviceUrl.startsWith("http://"))
        return data.serviceUrl.slice(7);
      if (data.serviceUrl.startsWith("https://"))
        return data.serviceUrl.slice(8);
      return data.serviceUrl;
    }
    return null;
  };

  return (
    <div className="detail-page">
      <div className="detail-page-inner">
        <div className="detail-header">
          <Link to="/" className="back-link">
            &larr; Volver al panel
          </Link>
          <span className="user-badge">
            {user?.username || "Usuario"}
          </span>
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
                <span>Nombre</span>
                <span>CPU</span>
                <span>Proveedor</span>
                <span>Memoria (GB)</span>
                <span>Estado</span>
                <span>Región</span>
                <span>IP master</span>
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
                const clusterKey = getInstanceClusterKey(inst);
                const clusterLabel =
                  clusterKey === NO_CLUSTER_KEY ? "Sin cluster" : clusterKey;
                const masterUrl = getMasterUrlForInstance(inst);
                const masterLabel = getMasterLabelForInstance(inst);

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
                      {masterUrl && masterLabel ? (
                        <a
                          href={masterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {masterLabel}
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
