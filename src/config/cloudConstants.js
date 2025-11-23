// src/config/cloudConstants.js
export const BASE_URL = "http://localhost:8000"; 

// Proveedores soportados por tu API
export const PROVIDERS = ["aws", "gcp"];

// Estados soportados por tu API (InstanceStatus)
export const STATUSES = [
  "pending",
  "running",
  "stopped",
  "terminated",
  "error",
];

// Colores para el gráfico principal (por proveedor)
export const MAIN_COLORS = ["#63eaf1", "#63a8f1", "#6366f1"];

// Colores para cada estado (ahora con terminated y error)
export const STATUS_COLORS = {
  pending: "#f1de63",
  running: "#63f1b1",
  stopped: "#bdbcb5",
  terminated: "#f1a063",
  error: "#f16363",
};
