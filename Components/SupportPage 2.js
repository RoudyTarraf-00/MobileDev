import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

const RESEND_API_KEY = "re_NAGWffTq_DpPtrYLaRSAkCZMHg1FVW7hk"; 

const SupportPage = ({ navigation, route }) => {
  const user=route.param.user;


  const[name,setName]=useState(user.name || "");
  const[email,setEmail]=useState(user.email || "");
  const[message,setMessage]=useState("");
  const[sending,setSending]=useState(false);

  const sendSupport=async()=>
  {
    if(!name || !email || !message)
    {
      Alert.alert("missing info","Please Fill All Fields");
      return;
    }
    try {
      setSending(true);

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "RCB Support <onboarding@resend.dev>",
          // 👇 MUST be the same email that Resend told you in the error: hatoumbahaa24@gmail.com
          to: ["hatoumbahaa24@gmail.com"],
          subject: `Support Request from ${name}`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br/>")}</p>
          `,
        }),
      });

      const data = await response.json();
      console.log("Resend status:", response.status, data);

      if (response.ok) {
        Alert.alert("Thank you", "Your message was sent to support.");
        setMessage("");
      } else {
        Alert.alert(
          "Error",
          `Could not send message (status ${response.status}).`
        );
      }
    }
    catch(err)
    {
      console.log("network issue",err);
      Alert.alert('error',"Network error , please try again later");
        }
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Support</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="Describe your issue..."
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, sending && { opacity: 0.7 }]}
          onPress={sendSupport}
          disabled={sending}
        >
          <Text style={styles.buttonText}>
            {sending ? "Sending..." : "Send to Support"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportPage;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#020C2F" },
  container: { padding: 20, paddingBottom: 40 },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    color: "#E5E7EB",
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
  messageInput: {
    height: 120,
  },
  button: {
    marginTop: 22,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
});