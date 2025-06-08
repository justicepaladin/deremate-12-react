import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Expo Router

const EntregaDetails = () => {
  const { entregaObj } = useLocalSearchParams();
  const entrega = JSON.parse(entregaObj);

  return (
    <View style={styles.container}>
      {/* Cuadro Título */}
      <View style={styles.titleCard}>
        <Text style={styles.titleText}>Detalles de Entrega</Text>
      </View>

      {/* Cada item en su propio cuadro */}
      <View style={styles.dataCard}>
        <Text style={styles.label}>Dirección📍</Text>
        <Text style={styles.value}>{entrega.direccion}</Text>
      </View>

      <View style={styles.dataCard}>
        <Text style={styles.label}>Estado</Text>
        <Text style={styles.value}>{entrega.estado}</Text>
      </View>

      <View style={styles.dataCard}>
        <Text style={styles.label}>Fecha de Creación</Text>
        <Text style={styles.value}>{entrega.fechaCreacion}</Text>
      </View>

      <View style={styles.dataCard}>
        <Text style={styles.label}>Observaciones</Text>
        <Text style={styles.value}>{entrega.observaciones}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  titleCard: {
    backgroundColor: '#007AFF', // Azul fuerte
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto blanco
  },
  dataCard: {
    backgroundColor: '#E6F0FF', // Azul clarito
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0056B3', // Azul más oscuro para el label
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    color: '#333333',
  },
});

export default EntregaDetails;
