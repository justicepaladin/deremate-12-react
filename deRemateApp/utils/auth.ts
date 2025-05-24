import AsyncStorage from '@react-native-async-storage/async-storage';

// Define una clave constante para el token para evitar errores tipográficos.
const TOKEN_STORAGE_KEY = '@MyApp:AuthToken'; // Puedes personalizar esta clave

/**
 * Guarda el token de autenticación en AsyncStorage.
 * @param token El token JWT a guardar.
 * @returns Promesa que se resuelve cuando el token se ha guardado.
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    console.log('Token guardado exitosamente en AsyncStorage.');
  } catch (error) {
    console.error('Error al guardar el token en AsyncStorage:', error);
    // Podrías lanzar el error o manejarlo de otra forma si es crítico para tu app
    // throw new Error('No se pudo guardar el token de sesión.');
  }
};

/**
 * Obtiene el token de autenticación desde AsyncStorage.
 * @returns Promesa que se resuelve con el token (string) si existe, o null si no.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (token !== null) {
      console.log('Token recuperado de AsyncStorage.');
    } else {
      console.log('No se encontró ningún token en AsyncStorage.');
    }
    return token;
  } catch (error) {
    console.error('Error al obtener el token desde AsyncStorage:', error);
    // Devuelve null en caso de error para no bloquear el flujo de la app,
    // asumiendo que la ausencia de token es un estado válido (usuario no logueado).
    return null;
  }
};

/**
 * Elimina el token de autenticación de AsyncStorage.
 * @returns Promesa que se resuelve cuando el token se ha eliminado.
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    console.log('Token eliminado de AsyncStorage.');
  } catch (error) {
    console.error('Error al eliminar el token de AsyncStorage:', error);
    // throw new Error('No se pudo eliminar el token de sesión.');
  }
};