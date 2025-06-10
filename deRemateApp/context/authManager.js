import AsyncStorage from '@react-native-async-storage/async-storage';

const listeners = new Set();

export const authTokenManager = {
    async getToken() {
        return await AsyncStorage.getItem('token');
    },

    async setToken(newToken) {
        await AsyncStorage.setItem('token', newToken);
        listeners.forEach((cb) => cb(newToken));
    },

    async clearToken() {
        await AsyncStorage.removeItem('token');
        listeners.forEach((cb) => cb(null));
    },

    subscribe(callback) {
        console.log(1)
        listeners.add(callback);
        return () => {
            listeners.delete(callback)
        };
    },
};
