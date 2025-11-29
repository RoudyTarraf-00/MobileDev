import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from "react-native";

const Request = (props) => {
  const phone = props.route.params.user.phone;

  const [form, setForm] = useState({
    senderPhone: "",
    amount: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [globalUser, setGlobalUser] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const url = `https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/users/phone/${phone}`;

      const response = await fetch(url);

      if (response.ok) {
        const user = await response.json();
        setGlobalUser(user);
      } else {
        const msg = await response.text();
        alert("Server error: " + msg);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={60} color="#2563EB" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  async function Validate() {
    if (form.amount === "" || form.receiverPhone === "") {
      alert("All fields are required");
      return;
    }

    if(form.receiverPhone===phone){
        alert('Cant enter your phone number')
        return
    }

    if (form.amount <= 0) {
      alert("Amount cant be negative");
      return;
    }

    

    try {
      setLoading(true);

      const url = `https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/transactions/request?requesterPhone=${phone}&payerPhone=${form.senderPhone}&amount=${form.amount}&message=${encodeURIComponent(form.message)}`;


      const response = await fetch(url, { method: "POST" });

      if (!response.ok) {
        const msg = await response.text();
        alert("Error: " + msg);
        return;
      }

      alert("Request successful!");
      

      setForm({senderPhone: "",
    amount: "",
    message: "",})

    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (

    <KeyboardAvoidingView
    style={styles.pageContainer}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
  >
      <View style={styles.card}>
        <Text style={styles.title}>Request Money</Text>

        {/* Sender */}
        <Text style={styles.label}>Your Phone</Text>
        <TextInput value={globalUser.phone} editable={false} style={styles.inputDisabled} />

        {/* Receiver */}
        <Text style={styles.label}>Request from Phone</Text>
        <TextInput
          keyboardType="numeric"
          value={form.senderPhone}
          onChangeText={(change) => setForm({ ...form, senderPhone: change })}
          style={styles.input}
          placeholder="Enter receiver phone"
          placeholderTextColor="#9CA3AF"
        />

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          keyboardType="numeric"
          value={form.amount}
          onChangeText={(change) => setForm({ ...form, amount: change })}
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#9CA3AF"
        />

        {/* Message */}
        <Text style={styles.label}>Message (optional)</Text>
        <TextInput
          value={form.message}
          onChangeText={(change) => setForm({ ...form, message: change })}
          style={styles.input}
          placeholder="Enter message"
          placeholderTextColor="#9CA3AF"
        />

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={Validate}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Request;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#E5F0FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#020C2F",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    color: "#111827",
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },

  balance: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
  },

  inputDisabled: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
