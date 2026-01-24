import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
     <Stack.Screen name="index" options={{title:"Home", headerShown: true }} />
    <Stack.Screen name="details" options={{presentation:"formSheet", sheetAllowedDetents:[0.4,0.6,0.8] }} />

  </Stack>;
}
