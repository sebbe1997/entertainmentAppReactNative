import { Button, StyleSheet, TextInput, View } from "react-native";

export default function AddEntertainmentForm(){

    const styles = StyleSheet.create({
        textinput:{
            backgroundColor:"hsl(0, 0%, 93%)",
            color:"hsl(190, 16%, 37%)"
        }
    });

    return (<View>
        <TextInput placeholder="Title"/>
        <TextInput placeholder="Description"/>
        <TextInput placeholder="rating" />
        <View>
            <Button title="Submit"/>
            <Button title="cancel"/>

        </View>
    </View>)
}