import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native"

const PendingRequests =(props)=>{


    const user = props.route.params.user

    const [transactions,setTransactions]= useState([])
    const [loading,setLoading]= useState(true);

   

    const fetchTransactions = async () => {
      
      try {
        setLoading(true)
        const response = await fetch(
          `https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/transactions//requests/${user.phone}`,
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
        setLoading(false);
        
      }
    };


    useEffect(()=>{
        fetchTransactions()
    },[])


    if(loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator size={80} />
                    <Text>Loading...</Text>
                </View>
            )
        }


        const renderTransactions = (transactions = [], globalUser) => {
  // Filter out REQUEST transactions first
 

  // Limit to 3
  const recent = [...transactions];

  if (!recent.length) {
    return (
      <View style={styles.transactionsSection}>
        <Text style={styles.transactionsTitle}>Pending Transactions needs accept</Text>
        <Text style={{ color: "#9CA3AF", fontSize: 13 }}>
          No transactions found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.transactionsSection}>
      <Text style={styles.transactionsTitle}>Recent Transactions</Text>

      {recent.map((tx) => (
        <View key={tx.id} style={styles.transactionRow}>
          <View>
            <Text style={styles.transactionName}>{tx.message}</Text>
            <Text style={styles.transactionDate}>
              {tx.date} · {tx.timestamp}
            </Text>
            <Text style={styles.transactionDate}>
              from: {tx.receiverPhone}
            </Text>

            <TouchableOpacity style={styles.acceptButton} onPress={()=>Accept(tx.id)}>
            <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>

          </View>

          <Text
            style={
              tx.senderPhone === globalUser.phone
                ? styles.transactionAmountRed
                : styles.transactionAmountGreen
            }
          >
            $ {Math.abs(tx.amount)}
          </Text>

            

        </View>
      ))}

     
     

    </View>
  );
};


async function Accept(id) {
  try {
    setLoading(true);

    const url = `https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/transactions/accept/${id}`;

    const response = await fetch(url, { 
      method: "PUT",
    });

    if (!response.ok) {
      const msg = await response.text();
      alert("Error: " + msg);
      return;
    }

    alert("Request accepted!");

    // Refresh pending list
    fetchTransactions();

  } catch (err) {
    alert("Network error: " + err.message);
  } finally {
    setLoading(false);
  }
}







     return(
        <ScrollView>
            <View style={styles.mainSection}>
           {renderTransactions(transactions,user)}
           </View>
        </ScrollView>
    )
}






const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#E5F0FF',   // match app background
        justifyContent:'center',
        alignItems:'center',
    },
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

  floatingButton: {
    position: 'absolute',
    bottom: 50,        // distance from bottom
    right: 30,         // distance from right
    backgroundColor: '#2563EB',  // your app’s blue
    width: 60,
    height: 60,
    borderRadius: 30,  // makes it round
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,     // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,        // stays on top
  },
  showAllButton: {
  marginTop: 10,
  paddingVertical: 8,
  paddingHorizontal: 14,
  alignSelf: "flex-start",
  backgroundColor: "#2563EB",          // light gray
  borderRadius: 8,
  alignSelf:'center'
},

showAllText: {
  color: "#F3F4F6",                    // nice blue
  fontSize: 14,
  fontWeight: "600",
},
mainSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 20,
  },

  acceptButton: {
  marginTop: 8,
  alignSelf: "flex-start",
  paddingVertical: 6,
  paddingHorizontal: 16,
  borderRadius: 999,           // pill shape
  backgroundColor: "#16A34A",  // green (matches success)
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 2,
},

acceptButtonText: {
  color: "#FFFFFF",
  fontSize: 13,
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: 0.5,
},

});



export default PendingRequests