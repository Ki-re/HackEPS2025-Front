// src/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchInstances() {
  const res = await fetch(`${BASE_URL}/api/v1/clusters/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error al cargar clusters");
  }

  const clusters = await res.json();
  
  // Extract all instances from all clusters and add cluster info
  const allInstances = [];
  clusters.forEach(cluster => {
    if (cluster.instances && Array.isArray(cluster.instances)) {
      cluster.instances.forEach(instance => {
        allInstances.push({
          ...instance,
          cluster_id: cluster.id,
          cluster_name: cluster.name,
          cluster_status: cluster.status,
          cluster_type: cluster.cluster_type
        });
      });
    }
  });
  
  return allInstances;
}

export async function fetchClusters() {
  const res = await fetch(`${BASE_URL}/api/v1/clusters/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error al cargar clusters");
  }

  return await res.json();
}