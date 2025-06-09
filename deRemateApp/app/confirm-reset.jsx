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
import { useLocalSearchParams, useRouter } from "expo-router";
import { confirmarNuevaPassword } from "../services/user";

const ConfirmResetScreen = () => {
  const { email } = useLocalSearchParams();
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!codigo.trim() || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await confirmarNuevaPassword({ email, codigo, password });
      Alert.alert("Contraseña actualizada", "Ya podés iniciar sesión.", [
        { text: "Ir a login", onPress: () => router.replace("login") },
      ]);
    } catch (err) {
      setError(err.message || "Error al confirmar la nueva contraseña.");
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
        <Text style={styles.title}>Confirmar Nueva Contraseña</Text>

        <TextInput
          placeholder="Código recibido"
          style={styles.input}
          value={codigo}
          onChangeText={setCodigo}
          keyboardType="number-pad"
        />
        <TextInput
          placeholder="Nueva contraseña"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Repetir nueva contraseña"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            title="Confirmar"
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

export default ConfirmResetScreen;
