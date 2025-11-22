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
import {
  PROVIDERS,
  STATUSES,
  MAIN_COLORS,
  STATUS_COLORS,
} from "../config/cloudConstants";

const Dashboard = () => {
  const navigate = useNavigate();

  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const mainChartData = useMemo(() => {
    const counts = Object.fromEntries(PROVIDERS.map((p) => [p, 0]));

    instances.forEach((inst) => {
      const provider = (inst.provider || "").toLowerCase();
      if (counts[provider] !== undefined) {
        counts[provider] += 1;
      }
    });

    return PROVIDERS
      .map((p) => ({
        name: p.toUpperCase(),
        provider: p,
        value: counts[p],
      }))
      .filter((item) => item.value > 0);
  }, [instances]);

  const smallChartsData = useMemo(() => {
    const baseStatusCounts = () =>
      Object.fromEntries(STATUSES.map((s) => [s, 0]));

    const byProviderStatus = Object.fromEntries(
      PROVIDERS.map((p) => [p, baseStatusCounts()])
    );

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
      clouding: toPieData(byProviderStatus.clouding),
    };
  }, [instances]);

  const barChartData = useMemo(() => {
    const baseStatusCounts = () =>
      Object.fromEntries(STATUSES.map((s) => [s, 0]));

    const byProviderStatus = Object.fromEntries(
      PROVIDERS.map((p) => [p, baseStatusCounts()])
    );

    instances.forEach((inst) => {
      const provider = (inst.provider || "").toLowerCase();
      const status = (inst.status || "").toLowerCase();

      if (!byProviderStatus[provider]) return;
      if (byProviderStatus[provider][status] === undefined) return;

      byProviderStatus[provider][status] += 1;
    });

    return PROVIDERS.map((p) => ({
      provider: p.toUpperCase(),
      ...byProviderStatus[p],
    }));
  }, [instances]);

  const handleMainSliceClick = (provider) => {
    navigate(`/detalle/provider/${provider}`);
  };

  const handleSmallSliceClick = (provider, status) => {
    navigate(`/detalle/status/${provider}/${status}`);
  };

  const renderPie = (data, { isMain = false, onSliceClick } = {}) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={isMain ? "85%" : "75%"}
          onClick={(_, index) => {
            if (!onSliceClick) return;
            const item = data[index];
            if (!item) return;
            onSliceClick(item);
          }}
        >
          {data.map((entry, index) => {
            const fillColor = isMain
              ? MAIN_COLORS[index % MAIN_COLORS.length]
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
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

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
      <div className="charts-row">
        <div className="main-chart-card">
          <div className="main-chart-title">
            <h2 className="card-title">Instancias por proveedor</h2>
          </div>

          <div className="main-chart-content">
            <div className="main-chart-pie-column">
              <div className="main-chart-pie">
                <div className="main-chart-pie-inner">
                  {renderPie(mainChartData, {
                    isMain: true,
                    onSliceClick: (item) =>
                      handleMainSliceClick(item.provider),
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
                          MAIN_COLORS[index % MAIN_COLORS.length],
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
                    margin={{ top: 10, right: 20, bottom: 30, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="provider" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    {STATUSES.map((status) => (
                      <Bar
                        key={status}
                        dataKey={status}
                        stackId="a"
                        fill={STATUS_COLORS[status]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="small-charts-wrapper">
          <div className="small-charts-legend">
            {STATUSES.map((status) => (
              <div className="legend-item" key={status}>
                <span
                  className="legend-color"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                />
                <span>{status}</span>
              </div>
            ))}
          </div>

          <div className="small-chart-block">
            <h3 className="small-chart-title">AWS</h3>
            <div className="small-chart">
              {renderPie(smallChartsData.aws, {
                onSliceClick: (item) =>
                  handleSmallSliceClick("aws", item.name),
              })}
            </div>
          </div>

          <div className="small-chart-block">
            <h3 className="small-chart-title">GCP</h3>
            <div className="small-chart">
              {renderPie(smallChartsData.gcp, {
                onSliceClick: (item) =>
                  handleSmallSliceClick("gcp", item.name),
              })}
            </div>
          </div>

          <div className="small-chart-block">
            <h3 className="small-chart-title">Clouding</h3>
            <div className="small-chart">
              {renderPie(smallChartsData.clouding, {
                onSliceClick: (item) =>
                  handleSmallSliceClick("clouding", item.name),
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
