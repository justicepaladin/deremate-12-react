import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { confirmarRegistro } from '../services/user';

const ConfirmRegisterScreen = () => {
  const { email: emailParam } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError("No se ha proporcionado un email para la confirmación.");
    }
  }, [emailParam]);

  const handleConfirm = async () => {
    if (!email || !codigo.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await confirmarRegistro({ email, codigo: codigo.trim() });
      Alert.alert(
        'Registro Confirmado',
        'Tu cuenta ha sido confirmada exitosamente. Ahora puedes iniciar sesión.',
        [{ text: 'Ir a Login', onPress: () => router.replace('login') }]
      );
    } catch (err) {
      setError(
        typeof err?.message === 'string' && err.message.trim().length > 0
          ? err.message
          : 'El código de confirmación es incorrecto o ha ocurrido un error.'
      );
      console.error('Confirmation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace('login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Confirmar Registro</Text>

        {email ? (
          <Text style={styles.infoText}>
            Se ha enviado un código de confirmación a:
            <Text style={styles.emailText}> {email}</Text>. Por favor, ingrésalo a continuación.
          </Text>
        ) : (
          <Text style={styles.infoText}>
            Por favor, verifica tu correo para obtener el código de confirmación.
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Código de Confirmación"
          value={codigo}
          onChangeText={setCodigo}
          keyboardType="number-pad"
          autoCapitalize="none"
          maxLength={6}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={styles.buttonActivityIndicator.color} />
          ) : (
            <Button
              title="Confirmar Código"
              onPress={handleConfirm}
              disabled={loading || !email}
              color={Platform.OS === 'android' ? '#FFFFFF' : '#007AFF'}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Volver a Inicio de Sesión"
            onPress={handleGoToLogin}
            color={Platform.OS === 'android' ? '#FFFFFF' : '#8A8A8E'}
          />
        </View>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    lineHeight: 24,
  },
  emailText: {
    fontWeight: 'bold',
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
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
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
  },
  buttonActivityIndicator: {
    color: '#007AFF',
  },
});

export default ConfirmRegisterScreen;
