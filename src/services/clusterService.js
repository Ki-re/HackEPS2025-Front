import { BASE_URL } from "../config/cloudConstants";

export async function createCluster(clusterData) {
  const res = await fetch(`${BASE_URL}/api/v1/clusters/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clusterData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Error en la creación del clúster' }));
    throw new Error(errorData.detail || errorData.message || 'Error desconocido');
  }

  return await res.json();
}
