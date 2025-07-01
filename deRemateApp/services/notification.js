import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiClient } from './api';


export const useTokenService = () => {
    const registerForPushNotifications = async () => {
        let token;

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Failed to get push token!');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
            const deviceName = await Device.deviceName || "Unknown Device";
            console.log('Expo Push Token:', token);
            console.log('Device Name:', deviceName);


            const response = await apiClient.post('/api/notifications/register', {
                expoToken: token,
                deviceName: deviceName,
            });

            if (response.status !== 200) {
                console.error('Error registering push token:', response.data);
                alert('Failed to register push token. Please try again later.');
            } else {
                console.log('Push token registered successfully');
            }
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            });
        }

        return token;
    }

    return {
        registerForPushNotifications,
    };
}

