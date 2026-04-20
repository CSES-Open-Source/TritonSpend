import React from "react";
import { View, Text } from "react-native";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dummy data for now – replace with props later if you want
const data = [
  { name: "Mon", amount: 50 },
  { name: "Tue", amount: 80 },
  { name: "Wed", amount: 40 },
  { name: "Thu", amount: 100 },
  { name: "Fri", amount: 60 },
];

const TransactionChart: React.FC = () => {
  return (
    <View style={{ height: 250, width: "100%", marginTop: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
        Daily Spending Amount
      </Text>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </View>
  );
};

export default TransactionChart;