import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const Entregas = () => {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://192.168.0.123:8080/mis-entregas")
      .then(response => {
        setEntregas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error cargando entregas:', error);
        setLoading(false);
      });
  }, []);

  const renderEntrega = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/EntregaDetails', params: { entregaObj: JSON.stringify(item) } })}
    >
      <Text style={styles.direccion}>{item.direccion}</Text>
      <Text>Estado: {item.estado}</Text>
      <Text>Creada: {item.fechaCreacion}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando entregas...</Text>
      </View>
    );
  }

  if (entregas.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay entregas disponibles.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entregas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEntrega}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  direccion: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Entregas;
