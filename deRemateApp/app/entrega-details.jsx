import { useEntregaService } from "@/services/entregas";
import { formatDate, formatEstado } from "@/utils/Formatters";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";
import HeaderLogo from "../components/HeaderLogo";
import { StarRating } from "../components/StarRating";



const EntregaDetails = () => {
const entregaService = useEntregaService();
const { entregaObj, entregaId } = useLocalSearchParams();

const [entrega, setEntrega] = useState(entregaObj ? JSON.parse(entregaObj) : undefined);
const [codigo, setCodigo] = useState("");
const [location, setLocation] = useState(null);
const [loading, setLoading] = useState(true);
const [updating, setUpdating] = useState(false);
const [mostrarImagen, setMostrarImagen] = useState(false);
const [showCodeInput, setShowCodeInput] = useState(false);
  const router = useRouter();

  const apiKey = Constants.expoConfig.extra.googleMapsApiKey;

  useEffect(() => {
    entregaService
      .getEntregaById(entregaId)
      .then((entrega) => setEntrega(entrega));
  }, [entregaId]);

  useEffect(() => {
    if (!entrega) {
      return;
    }

    Geocoder.init(apiKey);
    Geocoder.from(entrega.direccion)
      .then((json) => {
        const loc = json.results[0].geometry.location;
        setLocation({
          latitude: loc.lat,
          longitude: loc.lng,
        });
      })
      .catch((error) => {
        console.warn("Error geocoding:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiKey, entrega]);

  const openInGoogleMaps = () => {
    if (!location) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  const handleFinish = async () => {
    setUpdating(true);
    try {
      await entregaService.finalizarEntrega(entrega.id, codigo);
      Alert.alert("Entrega finalizada", "La entrega ha sido completada.");
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    setUpdating(true);
    try {
      await entregaService.cancelarEntrega(entrega.id);
      Alert.alert(
        "Entrega cancelada",
        "La entrega ha sido cancelada exitosamente."
      );
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar la entrega.");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#F7F9FB" }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 180 }]}>
        <HeaderLogo />
        <View style={styles.titleCard}>
          <Text style={styles.titleText}>Detalles de Entrega</Text>
        </View>

        <View style={styles.dataCard}>
          <Detail label="Dirección" value={entrega.direccion} icon="📍" />
          <Detail label="Estado" value={formatEstado(entrega.estado)} icon="🚚" />
          <Detail label="Fecha de Creación" value={formatDate(entrega.fechaCreacion)} icon="📅" />
          {entrega.fechaEntrega && (
            <Detail label="Fecha de Entrega" value={formatDate(entrega.fechaEntrega)} icon="📦" />
          )}
          <Detail label="Observaciones" value={entrega.observaciones} icon="📝" />

          {entrega.estado === "ENTREGADO" && (entrega.comentario || entrega.calificacion != null) && (
            <View style={styles.ratingCard}>
              {entrega.comentario && (
                <Detail label="Comentario" value={`"${entrega.comentario}"`} icon="🗣️" />
              )}
              {entrega.calificacion != null && (
                <View style={{ marginTop: 6 }}>
                  <StarRating rating={entrega.calificacion} size={22} />
                </View>
              )}
            </View>
          )}

          {entrega.estado === "ENTREGADO" && entrega.imagen && (
            <>
              <TouchableOpacity
                onPress={() => setMostrarImagen(!mostrarImagen)}
                style={{
                  backgroundColor: "#E6F0FF",
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  marginBottom: mostrarImagen ? 10 : 0,
                  marginTop: 10,
                }}
                activeOpacity={0.85}
              >
                <Text style={{ color: "#0056B3", fontWeight: "bold" }}>
                  {mostrarImagen ? "Ocultar imagen 📁" : "Ver comprobante 📦"}
                </Text>
              </TouchableOpacity>

              {mostrarImagen && (
                <View
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#C3DAFF",
                    marginTop: 10,
                  }}
                >
                  <Image
                    source={{ uri: `http://192.168.100.34:8080/images/${entrega.imagen}.png` }}
                    style={{
                      width: "100%",
                      height: 200,
                      resizeMode: "contain",
                      backgroundColor: "#fff",
                    }}
                  />
                </View>
              )}
            </>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cargando mapa...</Text>
          </View>
        ) : location ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={entrega.direccion}
                description="Destino de entrega"
              />
            </MapView>
            {entrega.estado !== "ENTREGADO" && entrega.estado !== "CANCELADO" && (
              <TouchableOpacity
                style={styles.mapsButton}
                onPress={openInGoogleMaps}
                activeOpacity={0.8}
              >
                <Text style={styles.mapsButtonText}>Navegar con Google Maps</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.errorText}>No se pudo obtener la ubicación.</Text>
        )}
      </ScrollView>

      {entrega.estado !== "ENTREGADO" && entrega.estado !== "CANCELADO" && (
        <View style={{ paddingBottom: 16, backgroundColor: "#F7F9FB" }}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={updating}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>
              {updating ? "Cancelando..." : "Cancelar Entrega"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateStatus}
            disabled={updating}
            activeOpacity={0.8}
          >
            <Text style={styles.updateButtonText}>
              {updating ? "Actualizando..." : "Actualizar Estado"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>

  );
};

function Detail({ label, value, icon }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {icon ? `${icon} ` : ""}
        {label}:
      </Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F9FB",
    padding: 0,
    flexGrow: 1,
  },
  titleCard: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  dataCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E6F0FF",
    paddingBottom: 6,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0056B3",
    flex: 1.2,
  },
  detailValue: {
    fontSize: 15,
    color: "#222",
    flex: 2,
    textAlign: "right",
  },
  ratingCard: {
    marginTop: 10,
    paddingTop: 12,
  },
  comentarioText: {
    fontSize: 15,
    color: "#0056B3",
    fontStyle: "italic",
    marginBottom: 4,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 1,
    backgroundColor: "#E6F0FF",
  },
  map: {
    flex: 1,
    minHeight: 250,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingEntrega: {
    marginTop: 150,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: "#555",
  },
  errorText: {
    textAlign: "center",
    marginTop: 18,
    color: "red",
    fontSize: 15,
  },
  updateButton: {
    backgroundColor: "#007AFF",
    margin: 18,
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: "#DC2626",
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  mapsButton: {
    backgroundColor: "#34A853",
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mapsButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 2,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "500",
  },
  codeInputContainer: {
    marginHorizontal: 18,
    marginTop: 8,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  codeInputLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0056B3",
    marginBottom: 8,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "#E6F0FF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#222",
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0", // Cambia el color de fondo para el estado deshabilitado
    opacity: 0.5, // Ajusta la opacidad para el estado deshabilitado
  },
});

export default EntregaDetails;
