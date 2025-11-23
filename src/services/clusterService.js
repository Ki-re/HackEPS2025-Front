import { BASE_URL } from "../config/cloudConstants";

export const createCluster = async (clusterData) => {
  try {
    console.log('🚀 [MOCK] Creant cluster amb dades:', clusterData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful response
    const mockResponse = {
      id: Math.floor(Math.random() * 1000),
      name: clusterData.name,
      status: 'creating',
      created_at: new Date().toISOString(),
      ...clusterData
    };
    
    console.log('✅ [MOCK] Cluster creat exitosament:', mockResponse);
    return mockResponse;
    
  } catch (error) {
    console.error('❌ [MOCK] Error creant cluster:', error);
    throw new Error('Error simulat en crear el clúster');
  }
};
