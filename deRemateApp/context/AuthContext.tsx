import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getToken, saveToken, removeToken } from '../utils/auth'; 
import { useRouter, useSegments, Slot } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native'; 

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  signIn: (newToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook personalizado para acceder al contexto de autenticación.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación.
 * Maneja el estado del token, la carga inicial y las redirecciones.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Comienza como true para cargar el token
  const segments = useSegments(); // Hook de Expo Router para obtener los segmentos de la ruta actual
  const router = useRouter();   // Hook de Expo Router para la navegación programática

  useEffect(() => {
    const loadTokenFromStorage = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          setToken(storedToken);
          // Aquí podrías añadir una validación del token con tu backend si fuera necesario
          // Por ejemplo, una llamada rápida para ver si el token sigue siendo válido.
          // Si no es válido, llamar a removeToken() y setToken(null).
        }
      } catch (e) {
        console.error("Error al cargar el token desde el almacenamiento:", e);
        // No es necesario hacer nada más aquí, la ausencia de token se manejará
      } finally {
        setIsLoading(false);
      }
    };

    loadTokenFromStorage();
  }, []); // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    // Si aún estamos cargando el token inicial, no hacemos nada de redirección todavía.
    if (isLoading) {
      return;
    }

    const inAppGroup = segments[0] as string === '(app)'; // Verifica si la ruta actual está dentro del grupo (app)

    // Rutas públicas (no requieren autenticación)
    const publicRoutes = ['login', 'register', 'confirm-register', 'password-recovery'];
    // La ruta raíz (index) también puede ser pública o una splash screen que redirige.
    // segments[0] será undefined o el nombre de la primera ruta si estamos en la raíz (ej. '/login')
    // o si es un index.tsx en app/ (segments.length === 0 o segments[0] === 'index')
    const currentRouteIsPublic = segments.length > 0 && publicRoutes.includes(segments[0]);
    const isRootIndex = (segments.length as number) === 0 || ((segments.length as number) === 1 && (segments[0] as string) === 'index');


    if (!token) {
      // Si NO hay token (usuario no autenticado):
      // Y no estamos en una ruta pública conocida (y tampoco en +not-found o _sitemap),
      // entonces redirigir a /login.
      if (!currentRouteIsPublic && !isRootIndex && segments[0] !== '+not-found' && segments[0] !== '_sitemap') {
        router.replace('login' as any);
      }
    } else {
      // Si SÍ hay token (usuario autenticado):
      // Y estamos en una ruta pública (como login o register) o en la raíz (index),
      // redirigir al home de la aplicación (dentro del grupo (app)).
      if (currentRouteIsPublic || isRootIndex) {
        router.replace('/(tabs)' as any);
      }
      // Si ya está en el grupo (app) o en otra ruta autenticada, no se hace nada.
    }
  }, [token, segments, isLoading, router]); // Se ejecuta cuando cambia el token, los segmentos o isLoading

  const signIn = async (newToken: string) => {
    setIsLoading(true); // Opcional: mostrar un loader brevemente
    await saveToken(newToken);
    setToken(newToken);
    setIsLoading(false);
    // La redirección se manejará por el useEffect anterior al cambiar el token y los segmentos.
    // O puedes forzarla aquí si es necesario:
    // router.replace('/(app)/home');
  };

  const signOut = async () => {
    setIsLoading(true); // Opcional
    await removeToken();
    setToken(null);
    setIsLoading(false);
    // La redirección a /login se manejará por el useEffect.
    // O puedes forzarla:
    // router.replace('/login');
  };

  // Renderiza un loader global mientras se verifica el token inicial.
  // Tus layouts también pueden tener sus propios loaders si es necesario.
  // Si `isLoading` es `false`, entonces el `useEffect` de redirección ya habrá actuado
  // o permitirá que el layout raíz (`app/_layout.tsx`) decida qué renderizar.
  // El `children` se pasa al layout raíz (`app/_layout.tsx` -> `RootLayoutNav`).
  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};