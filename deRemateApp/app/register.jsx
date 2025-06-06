import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { registerUser } from '../services/api';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [documento, setDocumento] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (emailToValidate) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToValidate);
  };

  const handleRegister = async () => {
    setError(null);

    if (!nombre.trim() || !apellido.trim() || !email.trim() || !username.trim() || !password.trim() || !documento.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('El correo ingresado no es válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (username.trim().includes(' ')) {
      setError('El nombre de usuario no puede contener espacios.');
      return;
    }
    const documentoInt = parseInt(documento.trim(), 10);
    if (isNaN(documentoInt) || documentoInt <= 0) {
      setError('El documento debe ser un número válido y positivo.');
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

      Alert.alert(
        "Registro Exitoso",
        "Tu cuenta ha sido creada. Revisa tu email para los siguientes pasos (si aplica).",
        [{ text: "OK", onPress: () => router.push({ pathname: 'confirm-register', params: { email: email.trim() } }) }]
      );

    } catch (err) {
      setError(err.message || 'Error en el registro. Inténtalo de nuevo.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <TextInput style={styles.input} placeholder="Nombre de Usuario" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Documento (DNI/Cédula)" value={documento} onChangeText={setDocumento} keyboardType="numeric" />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={styles.buttonActivityIndicator.color} />
          ) : (
            <Button title="Registrarse" onPress={handleRegister} disabled={loading} color={styles.button.color} />
          )}
        </View>

        <TouchableOpacity onPress={() => router.replace('login')}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    color: Platform.OS === 'android' ? '#FFFFFF' : '#007AFF',
  },
  buttonActivityIndicator: {
    color: '#007AFF',
  },
  linkText: {
    color: '#007AFF',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 15,
  },
});

export default RegisterScreen; 