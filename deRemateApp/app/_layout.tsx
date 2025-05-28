import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext'; // Ajusta la ruta
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Prevenir que el splash screen se oculte automáticamente antes de que AuthProvider esté listo.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, token } = useAuth(); // Usamos el token y isLoading del contexto

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync(); // Oculta el splash screen una vez que sabemos el estado de auth
    }
  }, [isLoading]);


  if (isLoading) {
    // Mientras AuthContext está en su `isLoading` inicial,
    // podrías no renderizar el Stack o mostrar un loader diferente.
    // O confiar en el splash screen de Expo.
    // `SplashScreen.preventAutoHideAsync()` y `SplashScreen.hideAsync()` ayudan con esto.
    return null; // O un loader global si prefieres en lugar del splash
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Registro' }} />
      <Stack.Screen name="confirm-register" options={{ title: 'Confirmar Registro' }} />
      <Stack.Screen name="password-recovery" options={{ title: 'Recuperar Contraseña' }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} /> {/* Si tienes un app/index.tsx */}
      {/* <Stack.Screen name="+not-found" /> */}
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

// ... (styles si los tienes)