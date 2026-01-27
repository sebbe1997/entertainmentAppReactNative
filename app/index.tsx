import { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from 'expo-router';
import { useEntertainments } from "./data/useEntertainments"
import { Entertainment } from "./types/entertainment"

export default function Index() {
  const { entertainments, isLoading, error, addEntertainment } = useEntertainments();
  const [text, setText] = useState<string>("");
  const router = useRouter();

  function onSubmit(text: string) {
    // if (text.trim()) {
    //   addEntertainment({
    //     Title: "test",
    //     description: "User added",
    //     rating: 0
    //   }).then(() => {
    //     setText("");
    //   }).catch((err) => {
    //     console.error("Failed to add entertainment:", err);
    //   });
    // }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}>
      {/* <TextInput 
        placeholder="add entertainment..." 
        value={text} 
        onChangeText={setText} 
        style={styles.inputstyle}
        placeholderTextColor="#999"
      /> */}
      
      <View style={styles.buttonview}>
        <Button title="Add" color={"#2532af"} onPress={() => onSubmit(text)}></Button>
      </View>
      
      {entertainments.map((entertainment, index) =>
        <Pressable key={index} onPress={() => router.navigate({ pathname: "/details", params: { guid: entertainment.id.toString() } })}>
          <View style={{ width: "auto" }}>
            <Text style={styles.datastyle}>{entertainment.id} {entertainment.Title}</Text>
          </View>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  datastyle: {
    fontSize: 32,
    marginVertical: 8,
  },
  inputstyle: {
    backgroundColor: "#363635",
    color: "white",
    width: "100%",
    borderWidth: 5,
    borderColor: "#ffaaff",
    padding: 10,
    marginBottom: 10,
  },
  buttonstyle: {
    backgroundColor: "#eaeaea",
    color: "white"
  },
  buttonview: {
    width: "100%",
    height: 58,
    marginBottom: 20,
  }
});