import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEntregaService } from '../../services/entregas';

export default function PendientesScreen() {
  const [entregas, setEntregas] = useState([]);
  const entregasService = useEntregaService();


  useEffect(() => {
    const fetchEntregasPendientes = async () => {
         const data = await entregasService.getPendientes();
         setEntregas(data);
    }

    fetchEntregasPendientes()
  }, []);

  const renderEntrega = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Entrega #{item.id}</Text>
      <Text>Dirección: {item.direccion}</Text>
      <Text>Estado: {item.estado}</Text>
      <Text>Fecha Creación: {item.fechaCreacion}</Text>
      <Text>Observaciones: {item.observaciones}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Entregas Pendientes</Text>
      <FlatList
        data={entregas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEntrega}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  list: { paddingBottom: 16 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});