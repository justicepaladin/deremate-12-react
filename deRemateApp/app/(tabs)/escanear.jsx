import QRScanner from "@/components/QRScanner";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEntregaService } from "@/services/entregas";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function EscanearScreen() {
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
  const { escanearQR } = useEntregaService();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleQRScanned = async (qrContent) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await escanearQR(qrContent);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      throw error;
    }
  };

  const handleSuccess = () => {
    Toast.show({
      type: "success",
      text1: "¡Éxito!",
      text2: "Entrega actualizada correctamente a estado EN_VIAJE",
      position: "top",
    });
    router.push("/(tabs)/pendientes");
    setShowScanner(false);
  };

  const handleCloseErrorAlert = () => {
    setErrorAlert({ visible: false, message: "" });
  };

  const handleRetryScan = () => {
    setErrorAlert({ visible: false, message: "" });
    // El usuario puede escanear nuevamente
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  const handleError = (message) => {
    setShowScanner(false); // Cierra el QRScanner
    setErrorAlert({ visible: true, message }); // Muestra el modal de error
  };

  if (showScanner) {
    return (
      <QRScanner
        onQRScanned={handleQRScanned}
        onClose={handleCloseScanner}
        onError={handleError}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <ErrorAlert
        visible={errorAlert.visible}
        message={errorAlert.message}
        onClose={handleCloseErrorAlert}
        showRetry={true}
        onRetry={handleRetryScan}
        title="Error al Escanear QR"
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Escanear QR
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].text }]}>
          Escanee el código QR de una entrega para cambiar su estado de
          &quot;PENDIENTE&quot; a &quot;EN VIAJE&quot;
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol
            name="qrcode"
            size={120}
            color={Colors[colorScheme].tint}
          />
        </View>

        <Text style={[styles.description, { color: Colors[colorScheme].text }]}>
          Para procesar una entrega, escanee el código QR que se encuentra en el
          producto o paquete correspondiente.
        </Text>

        <TouchableOpacity
          style={[
            styles.scanButton,
            { backgroundColor: Colors[colorScheme].tint },
          ]}
          onPress={() => setShowScanner(true)}
          disabled={isProcessing}
        >
          <IconSymbol name="camera" size={24} color="white" />
          <Text style={styles.scanButtonText}>
            {isProcessing ? "Procesando..." : "Iniciar Escáner"}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={[styles.infoTitle, { color: Colors[colorScheme].text }]}>
            Instrucciones:
          </Text>
          <Text style={[styles.infoText, { color: Colors[colorScheme].text }]}>
            • Asegúrese de que la entrega esté en estado &quot;PENDIENTE&quot;
            {"\n"}• Coloque el código QR dentro del marco de escaneo{"\n"}•
            Confirme el escaneo cuando se le solicite{"\n"}• El estado cambiará
            automáticamente a &quot;EN VIAJE&quot;
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
  },
  scanButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 20,
    borderRadius: 15,
    width: "100%",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
