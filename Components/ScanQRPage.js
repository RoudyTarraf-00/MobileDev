import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const ScanQRPage = ({ navigation, route }) => {
  const currentUser = route?.params?.user || null;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission || permission.status !== "granted") {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);

      if (!parsed.phone) {
        Alert.alert("Invalid QR", "QR code does not contain a phone number.");
        setScanned(false);
        return;
      }

      // 👉 Only pass receiverPhone; name is not needed
      navigation.replace("TransferPage", {
        user: currentUser,
        receiverPhone: parsed.phone,
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Invalid QR", "Unable to read QR code format.");
      setScanned(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff" }}>Requesting camera permission…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      <TouchableOpacity
        style={styles.scanAgainButton}
        onPress={() => setScanned(false)}
      >
        <Text style={styles.scanAgainText}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScanQRPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020C2F" },
  scanAgainButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  scanAgainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});