import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "../data/migrations";
import "../global.css";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="entertainments2.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="AddEntertainmentForm"
          options={{
            title: "Add Entertainment",
            presentation: "formSheet",
            sheetAllowedDetents: [0.4, 0.6, 0.8],
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: "Details",
            presentation: "formSheet",
            sheetAllowedDetents: [0.4, 0.6, 0.8],
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}