import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Dashboard.css";
import { fetchInstances } from "../api/client";
import { updateInstancesStatus } from "../services/clusterService";
import {
  STATUSES,
  MAIN_COLORS,
  STATUS_COLORS,
} from "../config/cloudConstants";
import { useAuth } from "../contexts/AuthContext";

const NO_CLUSTER_KEY = "no-cluster";

const getClusterColor = (clusterKey) => {
  const str = String(clusterKey || NO_CLUSTER_KEY);
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  const hue = hash % 360;
  const saturation = 80;
  const lightness = 80;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInstances();
        setInstances(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await updateInstancesStatus();
      const data = await fetchInstances();
      setInstances(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al refrescar los datos");
    } finally {
      setIsRefreshing(false);
    }
  };

  const mainChartData = useMemo(() => {
    const clusterMap = new Map();

    instances.forEach((inst) => {
      const rawId = inst.cluster_id || null;
      const key = rawId ? String(rawId) : NO_CLUSTER_KEY;
      if (!clusterMap.has(key)) {
        clusterMap.set(key, {
          name: rawId || "Sin cluster",
          clusterId: rawId,
          clusterKey: key,
          value: 0,
        });
      }
      const item = clusterMap.get(key);
      item.value += 1;
    });

    return Array.from(clusterMap.values())
      .filter((item) => item.value > 0)
      .map((item) => ({
        ...item,
        color: getClusterColor(item.clusterKey),
      }));
  }, [instances]);

  const smallChartsData = useMemo(() => {
    const baseStatusCounts = () =>
      Object.fromEntries(STATUSES.map((s) => [s, 0]));

    const byProviderStatus = {
      aws: baseStatusCounts(),
      gcp: baseStatusCounts(),
      // clouding: baseStatusCounts(),
    };

    instances.forEach((inst) => {
      const provider = (inst.provider || "").toLowerCase();
      const status = (inst.status || "").toLowerCase();

      if (!byProviderStatus[provider]) return;
      if (byProviderStatus[provider][status] === undefined) return;

      byProviderStatus[provider][status] += 1;
    });

    const toPieData = (statusCounts) =>
      STATUSES.map((s) => ({
        name: s,
        value: statusCounts[s],
      })).filter((item) => item.value > 0);

    return {
      aws: toPieData(byProviderStatus.aws),
      gcp: toPieData(byProviderStatus.gcp),
      // clouding: toPieData(byProviderStatus.clouding),
    };
  }, [instances]);

  const barChartData = useMemo(() => {
    const baseStatusCounts = () =>
      Object.fromEntries(STATUSES.map((s) => [s, 0]));

    const byCluster = {};

    instances.forEach((inst) => {
      const rawId = inst.cluster_id || null;
      const key = rawId ? String(rawId) : NO_CLUSTER_KEY;
      if (!byCluster[key]) {
        byCluster[key] = {
          cluster: rawId || "Sin cluster",
          clusterId: rawId,
          clusterKey: key,
          ...baseStatusCounts(),
        };
      }
      const status = (inst.status || "").toLowerCase();
      if (byCluster[key][status] === undefined) return;
      byCluster[key][status] += 1;
    });

    return Object.values(byCluster);
  }, [instances]);

  const handleSmallSliceClick = (provider, status) => {
    navigate(`/detalle/status/${provider}/${status}`);
  };

  const handleProviderDetail = (provider) => {
    navigate(`/detalle/provider/${provider}`);
  };

  const handleMainClusterSliceClick = (item) => {
    const clusterKey = item.clusterKey || NO_CLUSTER_KEY;
    navigate(`/detalle/cluster/${encodeURIComponent(clusterKey)}`);
  };

  const handleBarClick = (status, data) => {
    if (!data || !data.payload) {
      return;
    }
    const clusterKey = data.payload.clusterKey || NO_CLUSTER_KEY;
    navigate(
      `/detalle/cluster-status/${encodeURIComponent(clusterKey)}/${status}`
    );
  };

  const handleCreateClick = () => {
    setShowCreateOptions((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderPie = (data, { isMain = false, onSliceClick } = {}) => {
    const isEmpty = !data || data.length === 0;
    const pieData = isEmpty ? [{ name: "empty", value: 1 }] : data;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={isMain ? "85%" : "75%"}
            onClick={
              isEmpty
                ? undefined
                : (_, index) => {
                    if (!onSliceClick) return;
                    const item = data[index];
                    if (!item) return;
                    onSliceClick(item);
                  }
            }
            stroke={isEmpty ? "#d1d5db" : undefined}
            strokeWidth={isEmpty ? 2 : 1}
            fill={isEmpty ? "none" : undefined}
          >
            {!isEmpty &&
              data.map((entry, index) => {
                const fillColor = isMain
                  ? entry.color || MAIN_COLORS[index % MAIN_COLORS.length]
                  : STATUS_COLORS[entry.name] || "#999999";

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fillColor}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
          </Pie>
          {!isEmpty && <Tooltip />}
        </PieChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p>Error cargando datos: {error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>ALAE Multi-Cloud</h1>
        <div className="dashboard-actions">
          <span className="user-info">Benvingut, {user?.username || 'Usuari'}</span>
          <button className="logout-button" onClick={handleLogout}>
            Tancar Sessió
          </button>
        </div>
      </div>

      <div className="charts-row">
        <div className="main-chart-card">
          <div className="main-chart-header">
            <div className="main-chart-title">
              <h2 className="card-title">Instancias por cluster</h2>
            </div>

            <div className="main-chart-actions">
              <button className="refresh-button" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? 'Recargando...' : 'Recargar Datos'}
              </button>
              <div className="create-button-wrapper">
                <button className="create-button" onClick={handleCreateClick}>
                  + Crear instancia
                </button>

                {showCreateOptions && (
                  <div className="create-options">
                    <button
                      className="create-option-button"
                      onClick={() => {
                        setShowCreateOptions(false);
                        navigate("/crear/manual");
                      }}
                    >
                      Manual
                    </button>
                    <button
                      className="create-option-button"
                      onClick={() => {
                        setShowCreateOptions(false);
                        navigate("/crear/llm");
                      }}
                    >
                      LLM
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="main-chart-content">
            <div className="main-chart-pie-column">
              <div className="main-chart-pie">
                <div className="main-chart-pie-inner">
                  {renderPie(mainChartData, {
                    isMain: true,
                    onSliceClick: handleMainClusterSliceClick,
                  })}
                </div>
              </div>

              <div className="main-chart-legend">
                {mainChartData.map((item, index) => (
                  <div className="legend-item" key={index}>
                    <span
                      className="legend-color"
                      style={{
                        backgroundColor:
                          item.color || MAIN_COLORS[index % MAIN_COLORS.length],
                      }}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="main-chart-bar">
              <div className="main-chart-bar-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    layout="vertical"
                    margin={{ top: 10, right: 20, bottom: 10, left: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="cluster" width={100} />
                    <Tooltip />
                    {STATUSES.map((status) => (
                      <Bar
                        key={status}
                        dataKey={status}
                        stackId="a"
                        fill={STATUS_COLORS[status]}
                        onClick={(data) => handleBarClick(status, data)}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="small-charts-wrapper">
          <div className="small-chart-block">
            <div className="small-chart-header">
              <h3 className="small-chart-title">AWS</h3>
              <button
                className="small-plus-button"
                onClick={() => handleProviderDetail("aws")}
                aria-label="Ver todas las instancias de AWS"
              >
                +
              </button>
            </div>
            <div className="small-chart">
              {renderPie(smallChartsData.aws, {
                onSliceClick: (item) =>
                  handleSmallSliceClick("aws", item.name),
              })}
            </div>
          </div>

          <div className="small-chart-block">
            <div className="small-chart-header">
              <h3 className="small-chart-title">GCP</h3>
              <button
                className="small-plus-button"
                onClick={() => handleProviderDetail("gcp")}
                aria-label="Ver todas las instancias de GCP"
              >
                +
              </button>
            </div>
            <div className="small-chart">
              {renderPie(smallChartsData.gcp, {
                onSliceClick: (item) =>
                  handleSmallSliceClick("gcp", item.name),
              })}
            </div>
          </div>

          {/*
          <div className="small-chart-block">
            <div className="small-chart-header">
              <h3 className="small-chart-title">Clouding</h3>
              <button
                className="small-plus-button"
                onClick={() => handleProviderDetail("clouding")}
                aria-label="Ver todas las instancias de Clouding"
              >
                👁
              </button>
            </div>
            <div className="small-chart">
              {renderPie(smallChartsData.clouding, {
                onSliceClick: (item) =>
                  handleSmallSliceClick("clouding", item.name),
              })}
            </div>
          </div>
          */}

          <div className="small-charts-legend">
            {STATUSES.map((status) => (
              <div className="legend-item" key={status}>
                <span
                  className="legend-color"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                />
                <span>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;