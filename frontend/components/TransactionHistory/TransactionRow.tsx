import { View, StyleSheet, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

/*
  this is the container for every row in the transaction history, which includes the icon for the transaction,
  name of transaction, date of transaction, and the amount.

  props - this component takes props for the name, date, amount of the transactions

 */
export default function TransactionRow(props:any) {
    return(
        <View style={styles.NewTransaction}>
            <View style={styles.iconAndInfo}>
                    {/* place holder for transaction icon */}
                    <FontAwesome name="spotify" size={30} color={'#1ed760'}/>
                <View>
                    <Text>{props.name}</Text>
                    <Text>{props.date}</Text>
                </View>
            </View>
            <Text>-${props.amount}</Text>
            
        </View>
    );
}

const styles = StyleSheet.create({
  NewTransaction: {
    width: '100%',
    height:'30%',
    borderRadius:15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  header: {
    width:'100%',
    justifyContent:'space-between',
    flexDirection:'row'
  },
  iconAndInfo: {
    flexDirection:'row',
    gap:15,
    alignItems:'center'
  }

});
