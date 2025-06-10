import { useEntregaService } from "@/services/entregas";
import { StyleSheet, Text, View } from "react-native";

export const TotalesPorEstado = ({ entregas, estados }) => {
  const entregasService = useEntregaService();

  return (
    <View style={styles.dashboard}>
      <View style={styles.dashboardItem}>
        <Text style={styles.dashboardLabel}>Totales</Text>
        <Text style={styles.dashboardValue}>{entregas?.length}</Text>
      </View>
      {entregasService
        .agruparYContarEstadosEntrega(entregas, estados)
        .map((item) => (
          <View style={styles.dashboardItem} key={item.estado}>
            <Text style={styles.dashboardLabel}>{item.descripcion}</Text>
            <Text style={styles.dashboardValue}>{item.count}</Text>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
