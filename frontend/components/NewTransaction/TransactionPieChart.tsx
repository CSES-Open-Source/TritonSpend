import React from "react";
import { View, Text } from "react-native";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dummy category-spending data – replace or pass via props
const data = [
  { category: "Food", value: 150 },
  { category: "Drinks", value: 75 },
  { category: "Entertainment", value: 100 },
  { category: "Groceries", value: 125 },
  { category: "Other", value: 50 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const CategoryPieChart: React.FC = () => {
  return (
    <View style={{ height: 250, width: "100%", marginTop: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
        Spending by Category
      </Text>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </View>
  );
};

export default CategoryPieChart;