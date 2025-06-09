import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useUsuario } from "@/hooks/useUsuario";
import { MaterialIcons } from "@expo/vector-icons";

export default function PerfilScreen() {
  const { signOut } = useAuth();
  const { usuario, loading, error } = useUsuario();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (error || !usuario) {
    return (
      <View style={styles.container}>
        <Text>Error al cargar el perfil.</Text>
        <Button title="Cerrar sesión" onPress={signOut} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>

      <MaterialIcons
        name="account-circle"
        size={100}
        color="#888"
        style={styles.icon}
      />

      <View style={styles.card}>
        <Text style={styles.label}>Nombre:</Text>
        <Text>{usuario.nombre}</Text>

        <Text style={styles.label}>Apellido:</Text>
        <Text>{usuario.apellido}</Text>

        <Text style={styles.label}>Documento:</Text>
        <Text>{usuario.documento}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text>{usuario.email}</Text>

        <Text style={styles.label}>Username:</Text>
        <Text>{usuario.username}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={{ color: usuario.estado === "ACTIVO" ? "green" : "red" }}>
          {usuario.estado}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cerrar sesión" onPress={signOut} color="#007aff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#f1f5ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  label: {
    fontWeight: "600",
    marginTop: 8,
  },
  icon: {
    marginBottom: 16,
    alignSelf: "center",
  },
  buttonContainer: {
    width: 200,
    alignSelf: "center",
  },
});
