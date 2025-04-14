import { View, StyleSheet, Text, ScrollView } from "react-native";
import NewTransactionButton from "@/components/NewTransaction/NewTransactionButton";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

/* 
  this function is the structure for the home screen which includes a graph, option to add transaction, and recent transaction history.
*/

export default function Home() {
  //place holder array for us to map through
  //passing it through props because I think it will be easier for us to call the API endpoints in the page and pass it through props
  const [ThreeTransactions, setThreeTransactions] = useState([]);
  const [updateRecent, setUpdateRecent] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const router = useRouter();
  // Fetch user authentication status
  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      method: "GET",
      credentials: "include", // Include cookies for session-based authentication
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Authenticated user:", data);
        setUser(data); // Set user data
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        router.push("/Login")
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/transactions/getTransactions/1", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
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
  }, [updateRecent]);
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "GET",
        credentials: "include", // Include cookies for session-based authentication
      });

      if (response.ok) {
        console.log("User logged out successfully");
        Toast.show({
          type: "success",
          text1: "Logged Out",
          text2: "You have been logged out successfully.",
        });
        setUser(null);
        router.push("/Login");
      } else {
        throw new Error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Logout Error",
        text2: "An error occurred while logging out.",
      });
    }
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#bbadff" }}>
        <ScrollView style={{ height: "100%" }}>
          <View style={styles.homeContainer}>
            <Text style={styles.Title}>Hello User</Text>
            <button
              onClick={logout}
              style={{
                backgroundColor: "red",
                padding: 10,
                borderRadius: 5,
                color: "white",
              }}
            >
              Logout
            </button>
            <View style={styles.graphContainer}>
              <Text style={{ fontSize: 30, fontWeight: "600" }}>$4201</Text>
              <View style={styles.graph}></View>
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
    height: 270,
    width: "100%",
    backgroundColor: "#8d82be",
    borderRadius: 15,
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  graph: {
    width: "100%",
    height: 180,
    backgroundColor: "white",
    borderRadius: 15,
  },
});
