import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
 
const API_BASE =
  "https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net";
const ProfilePage = (props) => {
  const { user } = props.route.params;
  const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
 
  const FetchProfile = async ()=>
  {
    try{
        const res= await fetch(`${API_BASE}/api/users/phone/${user.phone}`);
        const data= await res.json();
        setProfile(data);
    }
    catch(e)
    {
        console.log(e);
        Alert.alert("error","failed to laod the profile");
    }
    finally
    {
        setLoading(false);
    }
  }
 
  useEffect(()=>
{
    FetchProfile();
},[]);
  
 
    const updateField=(field,value)=>
    {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };
 
    const handleSave = async () => {
      try {
        setSaving(true);
    
        const url = `${API_BASE}/api/users/update/${profile.phone}`;
    
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
          }),
        });
    
        if (!response.ok) {
          const msg = await response.text();
          console.log("Update error:", msg);
          Alert.alert("Error", "Failed to save profile: " + msg);
          return;
        }
    
        const updated = await response.json();
        setProfile(updated);
    
        Alert.alert("Saved", "Profile updated successfully");
      } catch (e) {
        console.log(e);
        Alert.alert("Error", "Failed to save profile");
      } finally {
        setSaving(false);
      }
    };
 
 
 
    const pickDocument=async ()=>
    {
        const {status}=
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status!="granted")
        {
        Alert.alert("permisson required","Allow the access to your media ");
        }
 
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });
            if (!result.canceled) {
             setSelectedImage(result.assets[0].uri);
                }
            };
 
            const handleLogout=()=>
            {
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });

            };
 
            if(loading || !profile)
            {
                return (
                     <View style={styles.centered}>
                            <ActivityIndicator size="large" color="#ffffff" />
                            <Text style={styles.loadingText}>Loading profile…</Text>
                    </View>
                );
            }
            return (
                   <SafeAreaView style={styles.root}>
                      <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        showsVerticalScrollIndicator={false}
                      >
                        
                        <View style={styles.header}>
                          <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                              {(profile.name || "U")[0].toUpperCase()}
                            </Text>
                          </View>
                
                          <View style={{ flex: 1, marginLeft: 14 }}>
                            <Text style={styles.headerName}>{profile.name}</Text>
                            <Text style={styles.headerPhone}>{profile.phone}</Text>
                          </View>
                
                          <View style={styles.kycPill}>
                            <MaterialIcons name="verified-user" size={16} color="#0F5132" />
                            <Text style={styles.kycText}>KYC VERIFIED</Text>
                          </View>
                        </View>
                
                       
                        <View style={styles.card}>
                          <View style={styles.cardRow}>
                            <MaterialCommunityIcons
                              name="shield-account-outline"
                              size={22}
                              color="#0077ff"
                            />
                            <Text style={styles.cardTitle}>Account</Text>
                          </View>
                          <Text style={styles.cardSubtitle}>
                            Manage your personal details and documents.
                          </Text>
                        </View>
                
                        
                        <View style={styles.card}>
                          <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Personal Information</Text>
                          </View>
                
                          <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                              style={styles.input}
                              value={profile.name}
                              onChangeText={(text) => updateField("name", text)}
                              placeholder="Your full name"
                              placeholderTextColor="#999"
                            />
                          </View>
                
                          <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                              style={styles.input}
                              value={profile.email}
                              onChangeText={(text) => updateField("email", text)}
                              keyboardType="email-address"
                              autoCapitalize="none"
                              placeholder="your@email.com"
                              placeholderTextColor="#999"
                            />
                          </View>
                
                          <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Phone</Text>
                            <View style={styles.inputDisabledWrapper}>
                              <Text style={styles.inputDisabledText}>{profile.phone}</Text>
                            </View>
                            <Text style={styles.helperText}>
                              Phone number is linked to your wallet and cannot be changed.
                            </Text>
                          </View>
                        </View>
                
        
                        <View style={styles.card}>
                          <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Identity Verification</Text>
                            <Text style={styles.badgePending}>Verified</Text>
                          </View>
                
                          <Text style={styles.sectionDescription}>
                            Upload a clear photo of your passport or national ID. Make sure all
                            details are visible.
                          </Text>
                
                          <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
                            <MaterialCommunityIcons
                              name="cloud-upload-outline"
                              size={26}
                              color="#0077ff"
                            />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                              <Text style={styles.uploadTitle}>
                                {selectedImage ? "Change document" : "Upload document"}
                              </Text>
                              <Text style={styles.uploadSubtitle}>
                                JPG / PNG, max 10 MB recommended
                              </Text>
                            </View>
                          </TouchableOpacity>
                
                        {selectedImage && (
                            <View style={styles.previewWrapper}>
                              <Image source={{ uri: selectedImage }} style={styles.preview} />
                            </View>
                          )}
                        </View>
                      </ScrollView>
                
                     
                      <View style={styles.footer}>
                        <TouchableOpacity
                          style={[styles.primaryButton, saving && { opacity: 0.7 }]}
                          onPress={handleSave}
                          disabled={saving}
                        >
                          {saving ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text style={styles.primaryButtonText}>Save Changes</Text>
                          )}
                        </TouchableOpacity>
                
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                          <MaterialIcons name="logout" size={18} color="#ff4d4f" />
                          <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                      </View>
                    </SafeAreaView>
            );
        };
        
 
export default ProfilePage;
 
const styles = StyleSheet.create({
  // SCREEN
  root: {
    flex: 1,
    backgroundColor: "#050B2A",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#fff",
    opacity: 0.7,
  },
 
  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#050B2A",
  },
  headerName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  headerPhone: {
    marginTop: 2,
    fontSize: 13,
    color: "#B1B7D3",
  },
  kycPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#D1E7DD",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  kycText: {
    marginLeft: 4,
    fontSize: 11,
    color: "#0F5132",
    fontWeight: "600",
  },
 
  // GENERIC CARD
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2333",
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6C738A",
  },
 
  // SECTIONS
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2333",
  },
  sectionDescription: {
    fontSize: 13,
    color: "#6C738A",
    marginBottom: 14,
  },
  badgePending: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "#E6F4FF",
    color: "#0077ff",
    fontWeight: "600",
  },
 
  // FORM FIELDS
  fieldGroup: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: "#7A8199",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E5F1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1E2333",
    backgroundColor: "#F7F8FC",
  },
  inputDisabledWrapper: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#EFF1FA",
  },
  inputDisabledText: {
    fontSize: 14,
    color: "#7A8199",
  },
  helperText: {
    fontSize: 11,
    color: "#9AA0B8",
    marginTop: 4,
  },
 
  // UPLOAD
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E5F1",
    backgroundColor: "#F7F8FC",
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E2333",
  },
  uploadSubtitle: {
    fontSize: 11,
    color: "#8B91AA",
    marginTop: 2,
  },
  previewWrapper: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E5F1",
  },
  preview: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
 
  // FOOTER
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 10,
    backgroundColor: "rgba(5, 11, 42, 0.96)",
    borderTopWidth: 1,
    borderTopColor: "#202744",
  },
  primaryButton: {
    backgroundColor: "#0077ff",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom:30
  },
  logoutText: {
    marginLeft: 6,
    color: "#ff4d4f",
    fontSize: 14,
    fontWeight: "500",
  },
});