import axios from 'axios';
import { getToken } from '../utils/auth'; 

const TU_BACKEND_URL = 'http://192.168.100.34:8080';

const apiClient = axios.create({
  baseURL: `${TU_BACKEND_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && data.errors.length > 0) {
      return data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
    }
  }
  if (error.message) return error.message;
  return 'Ocurrió un error desconocido.';
};

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error(getErrorMessage(error));
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/registro', userData);
    return response.data;
  } catch (error) {
    console.error('Register API error:', error);
    throw new Error(getErrorMessage(error));
  }
};

export const confirmarRegistro = async (confirmData) => {
  try {
    await apiClient.post('/confirmar-registro', confirmData);
  } catch (error) {
    console.error('Confirmar Registro API error:', error);
    throw new Error(getErrorMessage(error));
  }
};

export const solicitarRecuperacionPassword = async (recoveryData) => {
  try {
    const response = await apiClient.post('/olvido-password', recoveryData);
    return response.data;
  } catch (error) {
    console.error('Solicitar Recuperación API error:', error);
    throw new Error(getErrorMessage(error));
  }
};

export const confirmarNuevaPassword = async (recoveryConfirmData) => {
  try {
    await apiClient.post('/confirmar-passwd-recovery', recoveryConfirmData);
  } catch (error) {
    console.error('Confirmar Nueva Password API error:', error);
    throw new Error(getErrorMessage(error));
  }
}; 