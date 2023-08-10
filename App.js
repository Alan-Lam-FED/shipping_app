import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OrderCreation from "./src/screen/orderCreation/orderCreation";
import ParcelWaiting from "./src/screen/ParcelWaiting/parcelWaiting";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name={"OrderCreation"}
          component={OrderCreation}
          options={{
            headerStyle: {
              backgroundColor: "#F04730",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "400",
            },
            headerTitleAlign: "center",
          }}
        /> */}
        <Stack.Screen
          name={"ParcelWaiting"}
          component={ParcelWaiting}
          options={{
            headerStyle: {
              backgroundColor: "#F04730",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "400",
            },
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
