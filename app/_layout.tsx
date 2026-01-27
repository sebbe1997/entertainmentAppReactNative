import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "./data/migrations";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="entertainments2.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="index" options={{title:"Home", headerShown: true }} />
        <Stack.Screen name="details" options={{presentation:"formSheet", sheetAllowedDetents:[0.4,0.6,0.8] }} />
      </Stack>
    </SQLiteProvider>
  );
}
