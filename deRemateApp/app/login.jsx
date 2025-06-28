import { authTokenManager } from "@/context/authManager";
import { useTokenService } from "@/services/notification";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import { loginUser } from "../services/user";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const tokenService = useTokenService()

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Por favor, introduce tu email y contraseña.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(email.trim(), password.trim());
      if (data && data.jwtToken) {
        await authTokenManager.setToken(data.jwtToken);

        Alert.alert("Login exitoso", "Bienvenido/a a la aplicación.", [
          { text: "OK", onPress: () => null },
        ]);

        // Register for push notifications after successful login
        const token = await tokenService.registerForPushNotifications();

      } else {
        setError("Respuesta inesperada del servidor o token no encontrado.");
      }
    } catch (err) {
      setError("Las credenciales no son válidas o ha ocurrido un error.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HeaderLogo />

        <View style={styles.titleCard}>
          <Text style={styles.titleText}>Inicio de Sesión</Text>
        </View>

        <View style={styles.dataCard}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("register")}
          style={styles.linkCard}
        >
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("password-recovery")}
          style={styles.linkCard}
        >
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  titleCard: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFF",
  },
  dataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    color: "#007AFF",
  },
  linkCard: {
    backgroundColor: "#E6F0FF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  linkText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default LoginScreen;
