import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, token } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Registro' }} />
      <Stack.Screen name="confirm-register" options={{ title: 'Confirmar Registro' }} />
      <Stack.Screen name="password-recovery" options={{ title: 'Recuperar Contraseña' }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
} 