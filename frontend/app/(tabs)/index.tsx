import { View, StyleSheet, Text, ScrollView } from "react-native";
import NewTransactionButton from "@/components/NewTransaction/NewTransactionButton";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import CustomPieChart from "@/components/Graphs/PieChart";

/* 
  this function is the structure for the home screen which includes a graph, option to add transaction, and recent transaction history.
*/

export default function Home() {
  //place holder array for us to map through
  //passing it through props because I think it will be easier for us to call the API endpoints in the page and pass it through props
  const [ThreeTransactions, setThreeTransactions] = useState([]);
  const [updateRecent, setUpdateRecent] = useState(false);
  const [allTransactions, setAllTransactions] = useState([])
  const { userId } = useAuth();
  const categoryColors = new Map<number, string>([
    [1, '#b8b8ff'],
    [2, '#fff3b0'],
    [3, '#ff9b85'],
    [4, '#dde5b6'],
    [5, '#2b2d42'],
  ]);
  
  
  useEffect(() => {
    console.log(userId);
    fetch(
      `http://localhost:${BACKEND_PORT}/transactions/getTransactions/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    )
      .then((res) => {
        console.log(res.body);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setThreeTransactions(data.slice(0, 3));
      })
      .catch((error) => {
        console.error("API Error:", error);
      });


      fetch(`http://localhost:${BACKEND_PORT}/users/category/${userId}`, {
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, [updateRecent]);
  return ( 
    <>
      <View style={{ flex: 1, backgroundColor: "#bbadff" }}>
        <ScrollView style={{ height: "100%" }}>
          <View style={styles.homeContainer}>
            <Text style={styles.Title}>Hello User</Text>
            <View style={styles.graphContainer}>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>Total Spending</Text>
              {/* <View style={styles.graph}></View> */}
              {/* <CustomPieChart data={pieData} size={230} /> */}
            </View>
            {/* 
                  components for the new transaction button and the list of transaction history.
                */}
            <NewTransactionButton
              setUpdateRecent={setUpdateRecent}
              updateRecent={updateRecent}
            />
            <TransactionHistory list={ThreeTransactions} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    flexDirection: "column",
    gap: 17,
  },
  Title: {
    fontWeight: "bold",
    fontSize: 30,
    width: "100%",
  },
  graphContainer: {
    height: 350,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 30
  },
  graph: {
    width: "100%",
    height: 180,
    backgroundColor: "white",
    borderRadius: 15,
  },
});
