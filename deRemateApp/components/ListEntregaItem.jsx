import { formatDate, formatEstado } from "@/utils/Formatters";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ListEntregaItem({ item }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: "/entrega-details",
          params: { entregaId: item.id },
        });
      }}
      activeOpacity={0.85}
    >
      <View style={styles.headerRow}>
        <Text style={styles.entregaId}>#{item.id}</Text>
        <Text
          style={[
            styles.estado,
            item.estado === "ENTREGADO"
              ? styles.estadoEntregado
              : item.estado === "CANCELADO"
                ? styles.estadoCancelado
                : styles.estadoPendiente,
          ]}
        >
          {formatEstado(item.estado)}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.value}>{item.direccion}</Text>
      </View>
      {item.estado === "PENDIENTE" && (
        <View style={styles.infoRow}>
          <Text style={styles.icon}>🚛Deposito:</Text>
          <Text style={styles.value}>{item.direccionDeposito}</Text>
        </View>
      )}
      <View style={styles.infoRow}>
        <Text style={styles.icon}>📅</Text>
        <Text style={styles.value}>
          Creación: {formatDate(item.fechaCreacion)}
        </Text>
      </View>
      {item.fechaEntrega && (
        <View style={styles.infoRow}>
          <Text style={styles.icon}>📦</Text>
          <Text style={styles.value}>
            Entrega: {formatDate(item.fechaEntrega)}
          </Text>
        </View>
      )}
      {item.observaciones ? (
        <View style={styles.obsBox}>
          <Text style={styles.obsLabel}>📝 Observaciones:</Text>
          <Text style={styles.obsText}>{item.observaciones}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#E6F0FF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  entregaId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  estado: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  estadoEntregado: {
    backgroundColor: "#D1FAE5",
    color: "#059669",
  },
  estadoCancelado: {
    backgroundColor: "#FECACA",
    color: "#B91C1C",
  },
  estadoPendiente: {
    backgroundColor: "#FEF9C3",
    color: "#B45309",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  value: {
    fontSize: 15,
    color: "#222",
    flex: 1,
    flexWrap: "wrap",
  },
  obsBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  obsLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0056B3",
    marginBottom: 2,
  },
  obsText: {
    fontSize: 14,
    color: "#333",
  },
});
