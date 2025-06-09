import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { solicitarRecuperacionPassword } from "../services/user";

const PasswordRecoveryScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Por favor, ingresa un email válido.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await solicitarRecuperacionPassword({ email });

      router.replace({ pathname: "/confirm-reset", params: { email } });
    } catch (err) {
      setError(err.message || "No se pudo enviar el correo de recuperación.");
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
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.buttonContainer}>
          <Button
            title="Enviar código"
            onPress={handleSubmit}
            disabled={loading}
            color="#007AFF"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  errorText: { color: "red", marginBottom: 16, textAlign: "center" },
  buttonContainer: { width: "100%" },
});

export default PasswordRecoveryScreen;
