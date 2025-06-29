import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QRScanner({ onQRScanned, onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const colorScheme = useColorScheme();
  const alertOpenRef = useRef(false)

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.text, { color: Colors[colorScheme].text }]}>Solicitando permiso de cámara...</Text>
        <TouchableOpacity onPress={requestPermission} style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}> 
          <Text style={styles.buttonText}>Permitir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint, marginTop: 10 }]} onPress={onClose}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (alertOpenRef.current) return;
    alertOpenRef.current = true;
    Alert.alert(
      'QR Detectado',
      `¿Desea procesar este código QR?\n\nContenido: ${data}`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => alertOpenRef.current = false },
        { text: 'Procesar', onPress: () => { onQRScanned(data); alertOpenRef.current = false } },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={alertOpenRef.current ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <IconSymbol name="xmark" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Escanear QR</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.scanArea}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Coloque el código QR dentro del marco</Text>
          </View>
          {alertOpenRef.current && (
            <TouchableOpacity style={styles.scanAgainButton} onPress={() => alertOpenRef.current = false}>
              <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'black' 
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  camera: { 
    flex: 1 
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 50, 
    paddingHorizontal: 20, 
    paddingBottom: 20,
  },
  closeButton: {
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  headerText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  placeholder: { 
    width: 40 
  },
  scanArea: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  scanFrame: {
    width: 250, 
    height: 250, 
    borderWidth: 2, 
    borderColor: 'white', 
    borderRadius: 20, 
    backgroundColor: 'transparent',
  },
  scanText: { 
    color: 'white', 
    fontSize: 16, 
    textAlign: 'center', 
    marginTop: 20, 
    paddingHorizontal: 20 
  },
  scanAgainButton: {
    backgroundColor: 'white', 
    paddingHorizontal: 30, 
    paddingVertical: 15, 
    borderRadius: 25, 
    marginBottom: 50,
  },
  scanAgainText: { 
    color: 'black', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  text: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 20 
  },
  button: { 
    paddingHorizontal: 30, 
    paddingVertical: 15, 
    borderRadius: 25 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
}); 