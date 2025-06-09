import { ListEntregaItem } from "@/components/ListEntregaItem";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import HeaderLogo from "../../components/HeaderLogo";
import { useEntregaService } from "../../services/entregas";

export default function PendientesScreen() {
  const [entregas, setEntregas] = useState([]);
  const entregasService = useEntregaService();
  const total = entregas.length;
  const pendientes = entregas.filter(e => e.estado === "PENDIENTE" || e.estado === "EN_VIAJE").length;
  const completadas = entregas.filter(e => e.estado === "ENTREGADO").length;


  const fetchEntregasEntregas = async () => {
        try {
        const data = await entregasService.getEntregas();
        setEntregas(data);
        } catch (error) {
        console.error(error);
        }
    };

  useFocusEffect(
      useCallback(() => {
        fetchEntregasEntregas();
      }, [])
    );


  return (
    <View style={styles.container}>
      <HeaderLogo />

      <View style={styles.titleCard}>
        <Text style={styles.titleText}>Entregas Pendientes</Text>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.dashboardItem}>
          <Text style={styles.dashboardLabel}>Totales</Text>
          <Text style={styles.dashboardValue}>{total}</Text>
        </View>
        <View style={styles.dashboardItem}>
          <Text style={styles.dashboardLabel}>Pendientes</Text>
          <Text style={styles.dashboardValue}>{pendientes}</Text>
        </View>
        <View style={styles.dashboardItem}>
          <Text style={styles.dashboardLabel}>Completadas</Text>
          <Text style={styles.dashboardValue}>{completadas}</Text>
        </View>
      </View>

      <FlatList
        data={entregas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
        <ListEntregaItem item={item} />
        )}
        contentContainerStyle={styles.list}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 16 },
  dashboard: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  dashboardItem: {
    alignItems: "center",
  },
  dashboardLabel: {
    fontSize: 14,
    color: "#888",
  },
  dashboardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  titleCard: {
    backgroundColor: "#007AFF",
    padding: 10,
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
