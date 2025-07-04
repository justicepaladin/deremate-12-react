import { ListEntregaItem } from "@/components/ListEntregaItem";
import { TotalesPorEstado } from "@/components/TotalesPorEstado";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import HeaderLogo from "../../components/HeaderLogo";
import {
  ESTADOS_ENTREGA_PENDIENTE,
  useEntregaService,
} from "../../services/entregas";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function PendientesScreen() {
  const [entregas, setEntregas] = useState([]);
  const entregasService = useEntregaService();
  const router = useRouter();

  const fetchEntregasPendientes = async () => {
    try {
      const data = await entregasService.getEntregasPendientes();
      setEntregas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntregasPendientes();
    }, [])
  );

  const handleScanQR = () => {
    router.push("/(tabs)/escanear");
  };

  return (
    <View style={styles.container}>
      <HeaderLogo />

      <View style={styles.titleCard}>
        <Text style={styles.titleText}>Entregas Pendientes</Text>
        <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
          <IconSymbol name="qrcode" size={20} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Escanear QR</Text>
        </TouchableOpacity>
      </View>

      <TotalesPorEstado
        entregas={entregas}
        estados={ESTADOS_ENTREGA_PENDIENTE}
      />

      <FlatList
        data={entregas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ListEntregaItem item={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 16 },
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
    marginBottom: 10,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
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
