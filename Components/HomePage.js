import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

let globalUser;
const HomePage = (props) => {
  const user = props.route?.params?.user 
  const [transactions,setTransactions]= useState([])
  globalUser=user

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

   
    await new Promise(resolve => setTimeout(resolve, 1200));
    fetchTransactions()

    setRefreshing(false);

  };


  const fetchTransactions = async () => {
      
      try {
        const response = await fetch(
          `https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/transactions/${user.phone}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            setTransactions(data);
          } else {
            setTransactions([]);
          }
        } else {
          const errText = await response.text();
          console.error("Fetch failed:", errText);
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        
      }
    };


 useEffect(() => {
    

    

    fetchTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
         refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        {/* ================= TOP DARK SECTION ================= */}
        <View style={styles.topSection}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.profileRow}>
              <View>
                <Text style={styles.greeting}>Good evening,</Text>
                <Text style={styles.userName}>{user.name}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.notificationWrapper} onPress={()=>props.navigation.navigate('ProfilePage',{user})}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Services */}
          <View style={styles.servicesSection}>
            <Text style={styles.servicesTitle}>Services</Text>
            <View style={styles.servicesRow}>
              {/* Scan & Pay (selected) */}
              <TouchableOpacity style={styles.serviceBoxActive}>
                <View style={styles.serviceIconCircleActive}>
                  <MaterialIcons name="qr-code-scanner" size={22} color="#2563EB" />
                </View>
                <Text style={styles.serviceTextActive}>Scan & Pay</Text>
              </TouchableOpacity>

              {/* Others */}
              <TouchableOpacity style={styles.serviceBox} onPress={()=>props.navigation.navigate('TranserPage',{user})} >
                <Ionicons name="send" size={22} color="#FFFFFF" />
                <Text style={styles.serviceText}>Send Money</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.serviceBox}>
                <MaterialIcons name="call-received" size={22} color="#FFFFFF" />
                <Text style={styles.serviceText}>Receive Money</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.serviceBox}>
                <FontAwesome5 name="wallet" size={18} color="#FFFFFF" />
                <Text style={styles.serviceText}>Go to Wallet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ================= WHITE MAIN SECTION ================= */}
        <View style={styles.mainSection}>
         

          {/* Card */}
          <View style={styles.cardContainer}>
            <View style={styles.blueCard}>
              <Text style={styles.balanceTitle}>Current Balance</Text>
              <Text style={styles.balanceAmount}>
                $ {user.balance}
              </Text>

              <View style={styles.cardBottomRow}>
                <Text style={styles.cardNumber}>5282 3456 7890 1289</Text>
                <Text style={styles.cardDate}>09/25</Text>
              </View>

              
            </View>
          </View>


            {renderTransactions(transactions)}
          
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



const renderTransactions = (transactions = []) => {
  if (!transactions.length) {
    return (
      <View style={styles.transactionsSection}>
        <Text style={styles.transactionsTitle}>Recent Transactions</Text>
        <Text style={{ color: "#9CA3AF", fontSize: 13 }}>
          No transactions found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.transactionsSection}>
      <Text style={styles.transactionsTitle}>Recent Transactions</Text>

      {transactions.map((tx) => (
        <View key={tx.id} style={styles.transactionRow}>
          <View>
            <Text style={styles.transactionName}>{tx.message}</Text>
            <Text style={styles.transactionDate}>
              {tx.date} · {tx.timestamp}
            </Text>
            <Text style={styles.transactionDate}>
              From: {tx.senderPhone}
            </Text>
            <Text style={styles.transactionDate}>
              To: {tx.receiverPhone}
            </Text>
          </View>

          <Text
            style={
              tx.senderPhone===globalUser.phone
                ? styles.transactionAmountRed
                : styles.transactionAmountGreen
            }
          >
            {tx.senderPhone===globalUser.phone ? "- " : "+ "}$ {Math.abs(tx.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  /* ROOT */
  root: {
    flex: 1,
    backgroundColor: "#E5F0FF", // outer phone background
  },

  /* TOP DARK AREA */
  topSection: {
    backgroundColor: "#020C2F",
    paddingBottom: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  greeting: {
    color: "#CBD5F5",
    fontSize: 13,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  notificationWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  servicesSection: {
    marginTop: 24,
  },
  servicesTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "600",
  },
  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  /* Active service (Scan & Pay) */
  serviceBoxActive: {
    width: 72,
    height: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIconCircleActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0ECFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  serviceTextActive: {
    color: "#2563EB",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "500",
  },

  /* Other services */
  serviceBox: {
    width: 72,
    height: 90,
    backgroundColor: "#071738",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: {
    color: "#FFFFFF",
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
  },

  /* WHITE MAIN AREA */
  mainSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 20,
  },

  /* Card */
  cardContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  blueCard: {
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  balanceTitle: {
    color: "#DCE8FF",
    fontSize: 13,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 8,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 70,
  },
  cardNumber: {
    color: "#E2ECFF",
    letterSpacing: 2,
    fontSize: 12,
  },
  cardDate: {
    color: "#E2ECFF",
    fontSize: 12,
  },
  masterLogo: {
    position: "absolute",
    right: 18,
    top: 16,
    width: 46,
    height: 30,
  },

  /* Side color bars like design */
  sideAccentLeft: {
    position: "absolute",
    left: -12,
    top: 64,
    width: 26,
    height: 120,
    borderRadius: 20,
    backgroundColor: "#FF725E",
    opacity: 0.85,
  },
  sideAccentRight: {
    position: "absolute",
    right: -12,
    top: 82,
    width: 26,
    height: 120,
    borderRadius: 20,
    backgroundColor: "#FFA82E",
    opacity: 0.9,
  },

  /* Transactions */
  transactionsSection: {
    marginTop: 8,
    paddingBottom: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
    color: "#111827",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  transactionIcon: {
    width: 34,
    height: 34,
    marginRight: 14,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
  },
  transactionName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  transactionDate: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  transactionAmountRed: {
    marginLeft: "auto",
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
  transactionAmountGreen: {
    marginLeft: "auto",
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "600",
  },

  circleAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E0ECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  circleAvatarText: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
