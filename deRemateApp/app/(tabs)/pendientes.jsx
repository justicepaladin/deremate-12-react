import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useEntregaService } from "../../services/entregas";
import { useRouter } from "expo-router";
import HeaderLogo from "../../components/HeaderLogo";

export default function PendientesScreen() {
  const [entregas, setEntregas] = useState([]);
  const entregasService = useEntregaService();
  const router = useRouter();

  useEffect(() => {
    const fetchEntregasPendientes = async () => {
      try {
        const data = await entregasService.getPendientes();
        setEntregas(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEntregasPendientes();
  }, []);

  const renderEntrega = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: "/entrega-details",
          params: { entregaObj: JSON.stringify(item) },
        });
      }}
    >
      <Text style={styles.label}>Entrega #{item.id}</Text>
      <Text style={styles.value}>Dirección: {item.direccion}</Text>
      <Text style={styles.value}>Estado: {item.estado}</Text>
      <Text style={styles.value}>Fecha de Creación: {item.fechaCreacion}</Text>
      <Text style={styles.value}>Observaciones: {item.observaciones}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderLogo />

      <View style={styles.titleCard}>
        <Text style={styles.titleText}>Entregas Pendientes</Text>
      </View>

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
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 16 },
  titleCard: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#E6F0FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0056B3",
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 4,
  },
});
