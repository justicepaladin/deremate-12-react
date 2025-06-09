import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken, saveToken } from "../utils/auth";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const loadTokenFromStorage = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Error al cargar el token desde el almacenamiento:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokenFromStorage();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const publicRoutes = [
      "login",
      "register",
      "confirm-register",
      "password-recovery",
      "confirm-reset",
    ];
    const currentRouteIsPublic =
      segments.length > 0 && publicRoutes.includes(segments[0]);
    const isRootIndex =
      segments.length === 0 ||
      (segments.length === 1 && segments[0] === "index");

    if (!token) {
      if (
        !currentRouteIsPublic &&
        !isRootIndex &&
        segments[0] !== "+not-found" &&
        segments[0] !== "_sitemap"
      ) {
        router.replace("login");
      }
    } else {
      if (currentRouteIsPublic || isRootIndex) {
        router.replace("/(tabs)");
      }
    }
  }, [token, segments, isLoading, router]);

  const signIn = async (newToken) => {
    setIsLoading(true);
    await saveToken(newToken);
    setToken(newToken);
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    await removeToken();
    setToken(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, signIn, signOut, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
