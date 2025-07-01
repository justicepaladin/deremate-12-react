import { authTokenManager } from "@/context/authManager";
import axios from "axios";
import Constants from 'expo-constants';


export const BACKEND = Constants.expoConfig.extra.apiUrl


export const apiClient = axios.create({
  baseURL: `${BACKEND}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor para agregar el token de autorización a las peticiones
apiClient.interceptors.request.use(
  async (config) => {
    const token = await authTokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Log de las peticiones
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Log de responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 403) {
      await authTokenManager.clearToken()
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && data.errors.length > 0) {
      return data.errors.map((e) => `${e.field}: ${e.message}`).join(", ");
    }
  }
  if (error.message) return error.message;
  return "Ocurrió un error desconocido.";
};