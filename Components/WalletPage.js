// Components/WalletPage.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const WalletPage = ({ route }) => {
  const { user } = route?.params || {};
  const [showCVV, setShowCVV] = useState(false);
  const RESEND_API_KEY = "re_NAGWffTq_DpPtrYLaRSAkCZMHg1FVW7hk";


  const [cardStatus, setCardStatus] = useState("ACTIVE");

  const [showChangePin, setShowChangePin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const cardNumber = "5282 3456 7890 1289";
  const expiry = "09/25";
  const cvv = "842";

  const maskedNumber =
    cardNumber.slice(0, 4) +
    " •••• •••• " +
    cardNumber.slice(cardNumber.length - 4);

    const handleRequestPhysical = async () => {
        Alert.alert(
          "Request Sent",
          "Your request for a physical Visa card has been received."
        );
      
        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "RCB System <onboarding@resend.dev>",
              to: ["hatoumbahaa24@gmail.com"],
              subject: "New Physical Card Request",
              html: `
                <h2>New Card Request</h2>
                <p><strong>Name:</strong> ${user?.name}</p>
                <p><strong>Phone:</strong> ${user?.phone}</p>
                <p><strong>Balance:</strong> $${user?.balance}</p>
                <p><strong>Requested at:</strong> ${new Date().toLocaleString()}</p>
              `,
            }),
          });
      
          const data = await response.json();
          console.log("Resend response:", data);
      
        } catch (error) {
          console.log("Email error:", error);
        }
      };

  const handleToggleFreeze = () => {
    if (cardStatus === "ACTIVE") {
      Alert.alert(
        "Freeze card",
        "Are you sure you want to freeze this card? You won’t be able to use it for payments until you unfreeze it.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Freeze",
            style: "destructive",
            onPress: () => setCardStatus("FROZEN"),
          },
        ]
      );
    } else {
      Alert.alert(
        "Unfreeze card",
        "Do you want to unfreeze this card and allow payments again?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Unfreeze",
            onPress: () => setCardStatus("ACTIVE"),
          },
        ]
      );
    }
  };

  const handleSavePin = () => {
    if (!currentPin || !newPin || !confirmPin) {
      Alert.alert("Missing info", "Please fill all PIN fields.");
      return;
    }
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      Alert.alert("Invalid PIN", "PIN must be 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert("Mismatch", "New PIN and confirmation do not match.");
      return;
    }

    Alert.alert("PIN updated", "Your card PIN has been changed successfully.");

    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setShowChangePin(false);
  };

  const statusColor = cardStatus === "ACTIVE" ? "#16A34A" : "#DC2626";
  const statusText = cardStatus === "ACTIVE" ? "ACTIVE" : "FROZEN";

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header text */}
        <Text style={styles.title}>Your Wallet</Text>
        <Text style={styles.subtitle}>
          Manage your virtual card, security, and physical card request.
        </Text>

        {/* Balance summary */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>$ {user?.balance ?? 0}</Text>
          <Text style={styles.balanceSub}>
            Linked to card ending in {cardNumber.slice(-4)}
          </Text>
        </View>

        {/* Card status pill */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Card Status</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        {/* Back of Visa card */}
        <View style={styles.cardBackWrapper}>
          <View style={styles.cardBack}>
            {/* Black stripe */}
            <View style={styles.stripe} />

            {/* Signature + CVV row */}
            <View className="cvvRow" style={styles.cvvRow}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureText}>
                  {user?.name || "CARD HOLDER"}
                </Text>
              </View>

              <View style={styles.cvvBox}>
                <Text style={styles.cvvLabel}>CVV</Text>
                <Text style={styles.cvvValue}>{showCVV ? cvv : "***"}</Text>
              </View>
            </View>

            {/* Card info at bottom */}
            <View style={styles.cardInfoRow}>
              <View>
                <Text style={styles.cardInfoLabel}>CARD NUMBER</Text>
                <Text style={styles.cardInfoValue}>{maskedNumber}</Text>
              </View>

              <View>
                <Text style={styles.cardInfoLabel}>EXPIRES</Text>
                <Text style={styles.cardInfoValue}>{expiry}</Text>
              </View>
            </View>

            {/* Brand */}
            <View style={styles.brandRow}>
              <Text style={styles.brandText}>VISA</Text>
            </View>
          </View>

          {/* Toggle CVV */}
          <TouchableOpacity
            style={styles.toggleCVVButton}
            onPress={() => setShowCVV((prev) => !prev)}
          >
            <Ionicons
              name={showCVV ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#2563EB"
            />
            <Text style={styles.toggleCVVText}>
              {showCVV ? "Hide CVV" : "Show CVV"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Card Actions</Text>

          {/* Request physical card */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleRequestPhysical}
          >
            <View style={styles.actionIconWrapper}>
              <MaterialIcons name="local-shipping" size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Request Physical Card</Text>
              <Text style={styles.actionSubtitle}>
                Order a physical Visa card linked to this wallet.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleToggleFreeze}>
            <View style={styles.actionIconWrapper}>
              <Ionicons
                name={cardStatus === "ACTIVE" ? "snow-outline" : "flame-outline"}
                size={20}
                color="#2563EB"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>
                {cardStatus === "ACTIVE" ? "Freeze Card" : "Unfreeze Card"}
              </Text>
              <Text style={styles.actionSubtitle}>
                {cardStatus === "ACTIVE"
                  ? "Temporarily disable payments with this card."
                  : "Allow payments and ATM withdrawals again."}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Change PIN (show section) */}
          <TouchableOpacity
            style={[
              styles.actionRow,
              { borderBottomWidth: showChangePin ? 0 : 0.5 },
            ]}
            onPress={() => setShowChangePin((prev) => !prev)}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name="key-outline" size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Change PIN</Text>
              <Text style={styles.actionSubtitle}>
                Update your card PIN for ATM and POS usage.
              </Text>
            </View>
            <Ionicons
              name={showChangePin ? "chevron-up" : "chevron-down"}
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          {/* Change PIN form */}
          {showChangePin && (
            <View style={styles.changePinContainer}>
              <Text style={styles.pinLabel}>Current PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={currentPin}
                onChangeText={setCurrentPin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholder="••••"
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.pinLabel}>New PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={newPin}
                onChangeText={setNewPin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholder="••••"
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.pinLabel}>Confirm New PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={confirmPin}
                onChangeText={setConfirmPin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholder="••••"
                placeholderTextColor="#9CA3AF"
              />

              <TouchableOpacity
                style={styles.savePinButton}
                onPress={handleSavePin}
              >
                <Text style={styles.savePinText}>Save PIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020C2F",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#CBD5F5",
    fontSize: 13,
    marginBottom: 18,
  },

  balanceCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  balanceLabel: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  balanceValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  balanceSub: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 6,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusLabel: {
    color: "#CBD5F5",
    fontSize: 13,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F9FAFB",
    marginRight: 6,
  },
  statusText: {
    color: "#F9FAFB",
    fontSize: 11,
    fontWeight: "600",
  },

  cardBackWrapper: {
    marginBottom: 24,
  },
  cardBack: {
    backgroundColor: "#1F2937",
    borderRadius: 20,
    padding: 18,
    height: 220,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  stripe: {
    height: 42,
    backgroundColor: "#111827",
    borderRadius: 6,
    marginHorizontal: -18,
    marginTop: 4,
    marginBottom: 24,
  },
  cvvRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  signatureBox: {
    flex: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  signatureText: {
    fontSize: 12,
    color: "#374151",
  },
  cvvBox: {
    width: 70,
    marginLeft: 12,
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  cvvLabel: {
    color: "#9CA3AF",
    fontSize: 10,
  },
  cvvValue: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
  },
  cardInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfoLabel: {
    color: "#9CA3AF",
    fontSize: 10,
  },
  cardInfoValue: {
    color: "#F9FAFB",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },
  brandRow: {
    position: "absolute",
    right: 16,
    bottom: 14,
  },
  brandText: {
    color: "#F9FAFB",
    fontSize: 22,
    fontWeight: "800",
  },
  toggleCVVButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  toggleCVVText: {
    color: "#2563EB",
    fontSize: 13,
    marginLeft: 4,
    fontWeight: "600",
  },

  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  actionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0ECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  actionSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  changePinContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },
  pinLabel: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 8,
    marginBottom: 4,
  },
  pinInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  savePinButton: {
    marginTop: 14,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  savePinText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});