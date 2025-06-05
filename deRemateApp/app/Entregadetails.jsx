import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import Geocoder from 'react-native-geocoding';
// import * as Location from 'expo-location';

const EntregaDetails = ({ route }) => {
  const entregaObj = JSON.parse(route.params.entregaObj);

  // const [location, setLocation] = useState(null);
  // const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Geocoder.init('TU_API_KEY_GOOGLE_MAPS'); // Reemplazá con tu API Key real

    // Geocoder.from(entregaObj.direccion)
    //   .then(json => {
    //     const loc = json.results[0].geometry.location;
    //     setLocation({
    //       latitude: loc.lat,
    //       longitude: loc.lng,
    //     });
    //   })
    //   .catch(error => console.warn('Error geocoding:', error));

    // (async () => {
    //   const { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status === 'granted') {
    //     const current = await Location.getCurrentPositionAsync({});
    //     setUserLocation({
    //       latitude: current.coords.latitude,
    //       longitude: current.coords.longitude,
    //     });
    //   }
    // })();
  }, []);

  // const shouldShowMap =
  //   Platform.OS !== 'web' &&
  //   entregaObj.estado !== 'CANCELADO' &&
  //   entregaObj.estado !== 'ENTREGADO' &&
  //   location;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dirección: {entregaObj.direccion}</Text>
      <Text style={styles.label}>Estado: {entregaObj.estado}</Text>
      <Text style={styles.label}>Fecha de creación: {entregaObj.fechaCreacion}</Text>
      <Text style={styles.label}>Observaciones: {entregaObj.observaciones}</Text>

      {/* 
      {shouldShowMap && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={!!userLocation}
        >
          <Marker
            coordinate={location}
            title={entregaObj.direccion}
            description="Destino de la entrega"
          />
        </MapView>
      )}
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  map: {
    flex: 1,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default EntregaDetails;
