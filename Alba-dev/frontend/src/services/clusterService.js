export const createCluster = async (clusterData) => {
  try {
    const response = await fetch('/api/v1/clusters/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clusterData),
    });

    if (!response.ok) {
      // Intentem llegir el detall de l'error si el servidor el retorna
      const errorData = await response.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData.detail) || 'Error en crear el clúster');
    }

    return await response.json();
  } catch (error) {
    console.error('Error a createCluster:', error);
    throw error;
  }
};