import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { loginUser } from '../services/api'; 
import { useAuth } from '../context/AuthContext'; 
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor, introduce tu email y contraseña.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(email.trim(), password.trim());
      if (data && data.jwtToken) {
      await signIn(data.jwtToken);

      Alert.alert(
        'Login exitoso',
        'Bienvenido/a a la aplicación.',
        [{ text: 'OK', onPress: () => router.replace('/entregas') }]
      );
    }
 else {
        setError('Respuesta inesperada del servidor o token no encontrado.');
      }
    } catch (err) {
      setError(err.message || 'Las credenciales no son válidas o ha ocurrido un error.');
      console.error('Login error:', err);
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
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Iniciar Sesión</Text>

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

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={styles.buttonActivityIndicator.color} />
          ) : (
            <Button title="Iniciar sesión" onPress={handleLogin} disabled={loading} color={styles.button.color} />
          )}
        </View>

        <TouchableOpacity onPress={() => router.push('register')}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text> 
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('password-recovery')}> 
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
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

export default LoginScreen; 