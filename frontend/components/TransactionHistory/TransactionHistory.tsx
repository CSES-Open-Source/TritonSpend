import { View, StyleSheet, Text } from "react-native";
import TransactionRow from "./TransactionRow";
import { FontAwesome } from "@expo/vector-icons";

//container for the recent transaction history.
export default function TransactionHistory() {
    //place holder array for us to map through
    const ThreeTransactions = [
        {
            id : 1,
            name : "Spotify",
            date : "1/11/2025",
            amount : 10
        },
        {
            id : 2,
            name : "Spotify",
            date : "1/11/2025",
            amount : 10
        },
        {
            id : 3,
            name : "Spotify",
            date : "1/11/2025",
            amount : 10
        },
        
    ]
    return(
        <View style={styles.HistoryContainer}>
            <View style={styles.header}>
                <Text style = {{fontWeight:'bold'}}>Recent Transactions</Text>
                <FontAwesome name = "angle-right" size={20}/>
            </View>
            <View style = {styles.recentTranactions}>
                {ThreeTransactions.map((row) => (
                    <TransactionRow name = {row.name} date = {row.date} amount = {row.amount} key = {row.id}/>

                ))}
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
  HistoryContainer: {
    backgroundColor:'white',
    width: '100%',
    height:200,
    borderRadius:15,
    padding:15,
    gap:5
  },
  header: {
    width:'100%',
    justifyContent:'space-between',
    flexDirection:'row'
  },
  recentTranactions: {
    flexDirection: 'column',
    height:'100%'
  }

});
