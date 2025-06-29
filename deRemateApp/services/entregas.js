import { apiClient } from "./api";

export const ESTADOS_ENTREGA_PENDIENTE = ["PENDIENTE", "EN_VIAJE"]
export const ESTADOS_ENTREGA_HISTORIAL = ["ENTREGADO", "CANCELADO"]

const getDescripcionEstado = (estado) =>
({
  PENDIENTE: "Pendiente",
  EN_VIAJE: "En viaje",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}[estado])

const agruparYContarEstadosEntrega = (entregas, listaEstados) =>
  listaEstados.map((estado) => ({
    estado,
    descripcion: getDescripcionEstado(estado),
    count: entregas.filter((e) => e.estado === estado).length,
  }));

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

  const getEntregasPendientes = async () => {
    try {
      const response = await apiClient.get(`/api/entregas/mis-entregas?estados=${ESTADOS_ENTREGA_PENDIENTE.join(",")}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener entregas pendientes:", error);
      throw new Error(
        "No se pudieron obtener las entregas pendientes. Inténtalo de nuevo más tarde.",
      );
    }
  };

  const getHistorialEntregas = async () => {
    try {
      const response = await apiClient.get(`/api/entregas/mis-entregas?estados=${ESTADOS_ENTREGA_HISTORIAL.join(",")}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener entregas pendientes:", error);
      throw new Error(
        "No se pudieron obtener las entregas pendientes. Inténtalo de nuevo más tarde.",
      );
    }
  }

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

  const updateStatus = async (id, status) => {
    try {
      const response = await apiClient.put(`/api/entregas/${id}/estado?nuevoEstado=${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el estado de la entrega:", error);
      throw new Error(
        "No se pudo actualizar el estado de la entrega. Inténtalo de nuevo más tarde.",
      );
    }
  }

  const escanearQR = async (contenidoQR) => {
    try {
      const response = await apiClient.post("/api/entregas/escanear-qr", {
        contenidoQR: contenidoQR
      });
      return response.data;
    } catch (error) {
      console.error("Error al escanear QR:", error);
      throw new Error(
        "No se pudo procesar el QR. Verifique que la entrega esté en estado PENDIENTE.",
      );
    }
  }

  return {
    getEntregas,
    getEntregasPendientes,
    getHistorialEntregas,
    getEntregaById,
    updateStatus,
    escanearQR,
    agruparYContarEstadosEntrega,
  };
};
