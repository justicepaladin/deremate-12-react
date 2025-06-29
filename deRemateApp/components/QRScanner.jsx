import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';

export default function QRScanner({ onQRScanned, onClose }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // Verificar que sea un código QR
    if (type === BarCodeScanner.Constants.BarCodeType.qr) {
      console.log('QR escaneado:', data);
      
      // Mostrar confirmación antes de procesar
      Alert.alert(
        'QR Detectado',
        `¿Desea procesar este código QR?\n\nContenido: ${data}`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => setScanned(false),
          },
          {
            text: 'Procesar',
            onPress: () => {
              onQRScanned(data);
              setScanned(false);
            },
          },
        ]
      );
    } else {
      Toast.show({
        type: 'error',
        text1: 'Código no válido',
        text2: 'Por favor, escanee un código QR válido',
        position: 'top',
      });
      setScanned(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: Colors[colorScheme].text }]}>
          Solicitando permiso de cámara...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: Colors[colorScheme].text }]}>
          Sin acceso a la cámara
        </Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
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
            <Text style={styles.scanText}>
              Coloque el código QR dentro del marco
            </Text>
          </View>

          {scanned && (
            <TouchableOpacity style={styles.scanAgainButton} onPress={resetScanner}>
              <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
            </TouchableOpacity>
          )}
        </View>
      </BarCodeScanner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
    paddingHorizontal: 20,
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
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 