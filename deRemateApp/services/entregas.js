import { apiClient } from "./api";

export const useEntregaService = () => {
  const getEntregas = async () => {
    try {
      const response = await apiClient.get("/api/entregas/mis-entregas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener entregas:", error);
      throw new Error(
        "No se pudieron obtener las entregas. Inténtalo de nuevo más tarde.",
      );
    }
  };

  const getPendientes = async () => {
    try {
      const response = await apiClient.get("/api/entregas/pendientes");
      return response.data;
    } catch (error) {
      console.error("Error al obtener entregas pendientes:", error);
      throw new Error(
        "No se pudieron obtener las entregas pendientes. Inténtalo de nuevo más tarde.",
      );
    }
  };

  const getEntregaById = async (id) => {
    try {
      const response = await apiClient.get(`/api/entregas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener entrega por ID:", error);
      throw new Error(
        "No se pudo obtener la entrega. Inténtalo de nuevo más tarde.",
      );
    }
  };

  return {
    getEntregas,
    getPendientes,
    getEntregaById,
  };
};
