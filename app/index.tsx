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
      
      <View style={styles.buttonview}>
        <Button title="Add" color={"#2532af"} onPress={() => onSubmit(text)}></Button>
      </View>
      
      {entertainments.map((entertainment, index) =>
        <Pressable key={index} onPress={() => router.navigate({ pathname: "/details", params: { guid: entertainment.id.toString() } })}>
          <View style ={styles.datastyle}>
            <Text style={styles.datatext}>{entertainment.Title}</Text>
            <Text style={styles.datatext}>{entertainment.description} </Text>
            <Text style={styles.datatext}>[{entertainment.rating}]</Text>
          </View>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",

    backgroundColor: "#effada",
    height: "100%",
  },

  datastyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#12315a",
    width: "100%",
    marginBottom: 20,
  },
  datatext:{
     fontSize: 16,
    color: "#ffffff",
    width: "100%",
    textAlign: "center",
    marginBottom: 5,
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
    marginBottom: 20,
    
  }
});