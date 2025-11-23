// src/api/client.js
import { BASE_URL } from "../config/cloudConstants";

export async function fetchInstances() {
  const res = await fetch(`${BASE_URL}/api/v1/instances/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error al cargar instancias");
  }

  const data = await res.json();
  return data; // debería ser una lista de Instance según tu OpenAPI
}
