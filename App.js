import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddScreen from "./src/screens/AddScreen";
import EditScreen from "./src/screens/EditScreen";
import SummaryScreen from "./src/screens/SummaryScreen";

const Stack = createNativeStackNavigator();

const BASE_URL = "https://energy-saver-svrt.onrender.com/tracker";

// ✅ handles JSON + non-JSON + empty responses (important for DELETE)
async function request(url, options) {
  const res = await fetch(url, options);

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;
  try {
    data = isJson ? await res.json() : await res.text();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // backend sometimes returns json like {error:"..."}
    const msg =
      (data && typeof data === "object" && (data.error || data.message)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

const api = {
  getAll: () => request(BASE_URL),

  add: (payload) =>
    request(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    request(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  remove: (id) => request(`${BASE_URL}/${id}`, { method: "DELETE" }),
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" options={{ headerShown: false }}>
          {(props) => <WelcomeScreen {...props} api={api} />}
        </Stack.Screen>

        <Stack.Screen
          name="Home"
          options={{
            title: "Energy Saver Tracker",
            headerStyle: { backgroundColor: "#0d3b2a" },
            headerTintColor: "#2ecc71",
            headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          }}
        >
          {(props) => <HomeScreen {...props} api={api} />}
        </Stack.Screen>

        <Stack.Screen
          name="Add"
          options={{
            title: "Add Tracker Item",
            headerStyle: { backgroundColor: "#0d3b2a" },
            headerTintColor: "#2ecc71",
            headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          }}
        >
          {(props) => <AddScreen {...props} api={api} />}
        </Stack.Screen>

        <Stack.Screen
          name="Edit"
          options={{
            title: "Edit Tracker Item",
            headerStyle: { backgroundColor: "#0d3b2a" },
            headerTintColor: "#2ecc71",
            headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          }}
        >
          {(props) => <EditScreen {...props} api={api} />}
        </Stack.Screen>

        <Stack.Screen
          name="Summary"
          options={{
            title: "Usage Summary",
            headerStyle: { backgroundColor: "#0d3b2a" },
            headerTintColor: "#2ecc71",
            headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          }}
        >
          {(props) => <SummaryScreen {...props} api={api} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}