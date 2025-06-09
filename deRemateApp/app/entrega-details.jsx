import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";
import HeaderLogo from "../components/HeaderLogo";

const EntregaDetails = () => {
  const { entregaObj } = useLocalSearchParams();
  const entrega = JSON.parse(entregaObj);

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = Constants.expoConfig.extra.googleMapsApiKey;
  useEffect(() => {
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
  }, []);

  return (
    <View style={styles.container}>
      <HeaderLogo />
      <View style={styles.titleCard}>
        <Text style={styles.titleText}>Detalles de Entrega</Text>
      </View>
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
        </View>
      ) : (
        <Text style={styles.errorText}>No se pudo obtener la ubicación.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
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
  dataCard: {
    backgroundColor: "#E6F0FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0056B3",
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    color: "#333333",
  },
  mapContainer: {
    flex: 1,
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    height: 300,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
    fontSize: 16,
  },
});

export default EntregaDetails;
