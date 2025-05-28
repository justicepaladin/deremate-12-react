import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_STORAGE_KEY = '@MyApp:AuthToken';

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    console.log('Token guardado exitosamente en AsyncStorage.');
  } catch (error) {
    console.error('Error al guardar el token en AsyncStorage:', error);
  }
};

export const getToken = async () => {
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
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    console.log('Token eliminado de AsyncStorage.');
  } catch (error) {
    console.error('Error al eliminar el token de AsyncStorage:', error);
  }
}; 