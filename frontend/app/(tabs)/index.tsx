import { View, StyleSheet, Text, ScrollView } from "react-native";
import NewTransactionButton from "@/components/NewTransaction/NewTransactionButton";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import { useEffect, useState, useCallback } from "react";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import CustomPieChart from "@/components/Graphs/PieChart";
import { useFocusEffect } from "@react-navigation/native";
/* 
  this function is the structure for the home screen which includes a graph, option to add transaction, and recent transaction history.
*/
interface Category {
  id: number;
  category_name: string;
  category_expense: string;
  max_category_budget: string;
  user_id: number;
}
export default function Home() {
  //place holder array for us to map through
  //passing it through props because I think it will be easier for us to call the API endpoints in the page and pass it through props
  const [ThreeTransactions, setThreeTransactions] = useState([]);
  const [updateRecent, setUpdateRecent] = useState(false);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const { userId } = useAuth();
  const [username, setUsername] = useState("");
  const categoryColors = new Map<string, string>([
    ["Food", "#b8b8ff"], // blue
    ["Shopping", "#fff3b0"], //yellow
    ["Subscriptions", "#ff9b85"], // red
    ["Transportation", "#588157"], //green
    ["Others", "#2b2d42"], //black
  ]);

  useFocusEffect(
    useCallback(() => {
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
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setThreeTransactions(data.slice(0, 5));
        })
        .catch((error) => {
          console.error("API Error:", error);
        });

      fetch(`http://localhost:${BACKEND_PORT}/users/${userId}`, {
          method: "GET",
        })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUsername(data.username);
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
          setCategories(data);
          setTotal(
            data.reduce(
              (sum: number, category: { category_expense: string }) =>
                sum + parseFloat(category.category_expense),
              0,
            ),
          );
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, [updateRecent]),
  );

  const pieData = categories.map((category) => ({
    value: parseFloat(category.category_expense),
    color: categoryColors.get(category.category_name) || "#cccccc",
    name: category.category_name,
    id: category.id,
  }));
  console.log(categories);
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#00629B" }}>
        <ScrollView style={{ height: "100%" }}>
          <View style={styles.homeContainer}>
            <Text style={styles.Title}>Hello {username}</Text>
            <View style={styles.graphContainer}>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                Total Spending
              </Text>
              {/* <View style={styles.graph}></View> */}
              <CustomPieChart data={pieData} size={250} total={total} />
              <View style={styles.legendContainer}>
                {pieData.map((category) => {
                  return (
                    <View key={category.id} style={styles.legendItem}>
                      <View
                        style={[
                          styles.colorBox,
                          { backgroundColor: category.color },
                        ]}
                      />
                      <Text style={styles.legendText}>{category.name}</Text>
                    </View>
                  );
                })}
              </View>
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
    paddingHorizontal: 20,
    flexDirection: "column",
    gap: 17,
  },
  Title: {
    fontWeight: "bold",
    fontSize: 30,
    width: "100%",
    color: "#FFFFFF",
    paddingHorizontal: 10,
  },
  graphContainer: {
    height: 500,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 30,
    shadowRadius: 12,
    shadowOpacity: 0.4,
  },
  graph: {
    width: "100%",
    height: 180,
    backgroundColor: "#E6E6E6",
    borderRadius: 15,
  },
  legendContainer: {
    flexDirection: "row",
    marginTop: 20,
    flexWrap: "wrap",
    gap: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 16,
    color: "black",
  },
});
