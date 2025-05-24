import axios, { AxiosError } from 'axios';
import { getToken } from '../utils/auth'; 

const TU_BACKEND_URL = 'http://192.168.1.100:8080'; // Esto hay que reemplazarlo


interface LoginResponseDTO {
  jwtToken: string;

}

interface UsuarioDTO {
  id?: number; 
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password?: string; 
  documento: number;
}

interface ConfirmacionRegistroDTO {
  email: string;
  codigo: string;
}

interface ConfirmarRecoveryDTO {
  email: string;
  codigo: string;
  nuevaPasswordHash: string; 
}

// Interfaz para errores estructurados del backend (opcional pero útil)
interface BackendError {
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>; 
  
}

const apiClient = axios.create({
  baseURL: `${TU_BACKEND_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

// Interceptor de Solicitud: Añade el token JWT a las cabeceras si está disponible
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

// Función para extraer un mensaje de error más útil de la respuesta de Axios
const getErrorMessage = (error: AxiosError<BackendError>): string => {
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


/**
 * Realiza el login del usuario.
 * @param email Email del usuario.
 * @param password Contraseña del usuario.
 * @returns Promesa con LoginResponseDTO.
 */
export const loginUser = async (email: string, password: string): Promise<LoginResponseDTO> => {
  try {
    const response = await apiClient.post<LoginResponseDTO>('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error(getErrorMessage(error as AxiosError<BackendError>));
  }
};

/**
 * Registra un nuevo usuario.
 * @param userData Datos del usuario para el registro (sin el campo password si no se envía al backend después del hash).
 * El backend debería encargarse del hashing de la contraseña.
 * @returns Promesa con UsuarioDTO (los datos del usuario registrado, usualmente sin la contraseña).
 */
export const registerUser = async (userData: Omit<UsuarioDTO, 'id' | 'password'> & { password?: string }): Promise<UsuarioDTO> => {
  // El tipo Omit<...> & { password?: string } permite todos los campos de UsuarioDTO excepto 'id',
  // y hace 'password' opcional para el tipo de entrada, pero requerido en la lógica de negocio.
  try {
    const response = await apiClient.post<UsuarioDTO>('/registro', userData);
    return response.data;
  } catch (error) {
    console.error('Register API error:', error);
    throw new Error(getErrorMessage(error as AxiosError<BackendError>));
  }
};

/**
 * Confirma el registro de un usuario usando un código.
 * @param confirmData Datos para la confirmación (email y código).
 * @returns Promesa vacía si la confirmación es exitosa.
 */
export const confirmarRegistro = async (confirmData: ConfirmacionRegistroDTO): Promise<void> => {
  try {
    await apiClient.post<void>('/confirmar-registro', confirmData);
  } catch (error) {
    console.error('Confirmar Registro API error:', error);
    throw new Error(getErrorMessage(error as AxiosError<BackendError>));
  }
};

/**
 * Inicia el proceso de recuperación de contraseña.
 * @param recoveryData Puede ser solo el email: { email: string }
 * @returns Promesa con UsuarioDTO o un mensaje de éxito. (Depende de tu API)
 */
export const solicitarRecuperacionPassword = async (recoveryData: { email: string }): Promise<UsuarioDTO | void> => {
  // La API original devolvía UsuarioDTO, pero a veces solo se envía un email. Ajusta según tu backend.
  try {
    const response = await apiClient.post<UsuarioDTO | void>('/olvido-password', recoveryData);
    return response.data;
  } catch (error) {
    console.error('Solicitar Recuperación API error:', error);
    throw new Error(getErrorMessage(error as AxiosError<BackendError>));
  }
};

/**
 * Confirma la nueva contraseña después de la recuperación.
 * @param recoveryConfirmData Datos para confirmar la nueva contraseña (email, código, nueva contraseña).
 * @returns Promesa vacía si el cambio es exitoso.
 */
export const confirmarNuevaPassword = async (recoveryConfirmData: ConfirmarRecoveryDTO): Promise<void> => {
  try {
    await apiClient.post<void>('/confirmar-passwd-recovery', recoveryConfirmData);
  } catch (error) {
    console.error('Confirmar Nueva Password API error:', error);
    throw new Error(getErrorMessage(error as AxiosError<BackendError>));
  }
};

