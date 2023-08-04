import { registerRootComponent } from "expo";
import React, { useMemo, useState } from "react";
import "react-native-gesture-handler";
import Home from "./src/pages/home/home";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
