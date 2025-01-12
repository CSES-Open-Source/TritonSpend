import { View, StyleSheet, Text } from "react-native";
import NewTransactionButton from "@/components/NewTransaction/NewTransactionButton";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";

/* 
  this function is the structure for the home screen which includes a graph, option to add transaction, and recent transaction history.
*/
export default function HomeScreen() {
    return(
        <View style={styles.homeContainer}>
            <Text style = {styles.Title}>Hello User</Text>
            <View style = {styles.graphContainer}>
            <Text style={{fontSize:30, fontWeight:"600"}}>$4201</Text>
                <View style = {styles.graph}>
                </View>
            </View>
            {/* 
              components for the new transaction button and the list of transaction history.
             */}
            <NewTransactionButton/> 
            <TransactionHistory />
        </View>
    );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex:1,
    backgroundColor: '#bbadff',
    alignItems:'center', 
    paddingVertical:10,
    paddingHorizontal:50,
    flexDirection: 'column',
    gap:17,
  },
  Title: {
    fontWeight:'bold',
    fontSize:30,
    width:'100%'
  },
  graphContainer: {
    height: 270,
    width:'100%',
    backgroundColor: '#8d82be',
    borderRadius:15,
    padding:20,
    flexDirection:'column',
    justifyContent:'space-between'
  },
  graph: {
    width: '100%',
    height:180,
    backgroundColor:'white',
    borderRadius:15

  },
});
