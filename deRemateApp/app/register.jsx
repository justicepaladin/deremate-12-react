import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
import { registerUser } from "../services/user";

const RegisterScreen = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [documento, setDocumento] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState({
    nombre: false,
    apellido: false,
    email: false,
    username: false,
    password: false,
    documento: false,
  });
  const router = useRouter();

  const validateEmail = (emailToValidate) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToValidate);
  };

  const handleRegister = async () => {
    setError(null);

    // Check for empty fields and update invalidFields state
    const newInvalidFields = {
      nombre: !nombre.trim(),
      apellido: !apellido.trim(),
      email: !email.trim(),
      username: !username.trim(),
      password: !password.trim(),
      documento: !documento.trim(),
    };

    setInvalidFields(newInvalidFields);

    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !documento.trim()
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("El correo ingresado no es válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (username.trim().includes(" ")) {
      setError("El nombre de usuario no puede contener espacios.");
      return;
    }
    const documentoInt = parseInt(documento.trim(), 10);
    if (isNaN(documentoInt) || documentoInt <= 0) {
      setError("El documento debe ser un número válido y positivo.");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
        documento: documentoInt,
      };
      await registerUser(userData);

      router.replace({
        pathname: "/confirm-register",
        params: { email },
      });
    } catch (err) {
      setError(err.message || "Error en el registro. Inténtalo de nuevo.");
      console.error("Register error:", err);
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

        <TextInput
          style={[styles.input, invalidFields.nombre && styles.inputError]}
          placeholder="Nombre"
          value={nombre}
          onChangeText={(text) => {
            setNombre(text);
            setInvalidFields((prev) => ({ ...prev, nombre: false }));
          }}
        />
        <TextInput
          style={[styles.input, invalidFields.apellido && styles.inputError]}
          placeholder="Apellido"
          value={apellido}
          onChangeText={(text) => {
            setApellido(text);
            setInvalidFields((prev) => ({ ...prev, apellido: false }));
          }}
        />
        <TextInput
          style={[styles.input, invalidFields.email && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setInvalidFields((prev) => ({ ...prev, email: false }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          style={[styles.input, invalidFields.username && styles.inputError]}
          placeholder="Nombre de Usuario"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setInvalidFields((prev) => ({ ...prev, username: false }));
          }}
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, invalidFields.password && styles.inputError]}
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setInvalidFields((prev) => ({ ...prev, password: false }));
          }}
          secureTextEntry
        />
        <TextInput
          style={[styles.input, invalidFields.documento && styles.inputError]}
          placeholder="Documento (DNI/Cédula)"
          value={documento}
          onChangeText={(text) => {
            setDocumento(text);
            setInvalidFields((prev) => ({ ...prev, documento: false }));
          }}
          keyboardType="numeric"
        />

        <View style={styles.buttonsPanel}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.registerButtonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("login")}
          style={styles.linkCard}
        >
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Text>
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
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  registerButtonText: {
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

export default RegisterScreen;
