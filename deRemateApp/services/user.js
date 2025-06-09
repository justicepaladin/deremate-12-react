import { apiClient, getErrorMessage } from "./api";

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Login API error:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/registro', userData);
        return response.data;
    } catch (error) {
        console.error('Register API error:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const confirmarRegistro = async (confirmData) => {
    try {
        await apiClient.post('/auth/confirmar-registro', confirmData);
    } catch (error) {
        console.error('Confirmar Registro API error:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const solicitarRecuperacionPassword = async (recoveryData) => {
    try {
        const response = await apiClient.post('/auth/olvido-password', recoveryData);
        return response.data;
    } catch (error) {
        console.error('Solicitar Recuperación API error:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const confirmarNuevaPassword = async (recoveryConfirmData) => {
    try {
        await apiClient.post('/auth/confirmar-passwd-recovery', recoveryConfirmData);
    } catch (error) {
        console.error('Confirmar Nueva Password API error:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const getUsuarioDetalle = async () => {
    try {
        const response = await apiClient.get('/api/usuario');
        return response.data;
    } catch (error) {
        console.error('Obtener Usuario API error:', error);
        throw new Error(getErrorMessage(error));
    }
};