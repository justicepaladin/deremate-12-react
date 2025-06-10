import { authTokenManager } from "@/context/authManager";
import axios from "axios";
import Constants from 'expo-constants';


const BACKEND = Constants.expoConfig.extra.apiUrl


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
    console.log("TOKEN:", token);
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
    console.log(
      `Making API call to: ${config.url} with method: ${config.method}`,
    );
    if (config.method !== "get") {
      console.log(
        `Request body for ${config.method.toUpperCase()} ${config.url}:`,
        config.data,
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Log de responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(
      `Error response from ${error.config?.url}:`,
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 403) {
      console.log("Error 403: Acceso denegado. Se hace logout");
      await authTokenManager.clearToken()
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && data.errors.length > 0) {
      return data.errors.map((e) => `${e.field}: ${e.message}`).join(", ");
    }
  }
  if (error.message) return error.message;
  return "Ocurrió un error desconocido.";
};