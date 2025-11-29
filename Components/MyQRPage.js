import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const MyQRPage = ({ route }) => {
  const user = route?.params?.user || {};

  // What we encode inside the QR (phone + name)
  const qrPayload = JSON.stringify({
    type: "rcb_user",
    phone: user.phone,
    name: user.name,
  });

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>My QR Code</Text>
        <Text style={styles.subtitle}>
          Let others scan this code to send you money quickly.
        </Text>

        <View style={styles.qrWrapper}>
          <QRCode value={qrPayload} size={220} />
        </View>

        <Text style={styles.infoText}>{user.name}</Text>
        <Text style={styles.infoSub}>{user.phone}</Text>
      </View>
    </SafeAreaView>
  );
};

export default MyQRPage;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#020C2F" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#CBD5F5",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  qrWrapper: {
    marginTop: 40,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  infoText: {
    marginTop: 24,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  infoSub: {
    color: "#B1B7D3",
    marginTop: 4,
    fontSize: 13,
  },
});