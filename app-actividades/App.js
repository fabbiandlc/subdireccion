// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import Calendario from "./Calendario";
import { ActivitiesProvider } from "./ActivitiesContext";
import { styles } from "./styles"; // Importa los estilos



const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ActivitiesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Inicio") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Calendario") {
                iconName = focused ? "calendar" : "calendar-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#007BFF",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Inicio" component={HomeScreen} />
          <Tab.Screen name="Calendario" component={Calendario} />
        </Tab.Navigator>
      </NavigationContainer>
    </ActivitiesProvider>
  );
}