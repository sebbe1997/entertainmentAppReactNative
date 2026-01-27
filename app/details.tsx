import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native"
import { useEntertainments } from "./data/useEntertainments";
import { Entertainment } from "./types/entertainment";


const styles =StyleSheet.create({

    viewstyle:{
        backgroundColor:"#effada",
        height:"100%"
    }
});

export default function details(){
    // const { id } = useLocalSearchParams();
    const { guid } = useLocalSearchParams();
    const [entertainment, setEntertainment ] = useState<Entertainment>({} as Entertainment);
    const { GetEntertainmentsById } = useEntertainments();
    
   

    useEffect(() => {
        const id = Number(guid);
        GetEntertainmentsById(id);
        console.log("Fetching details for item with id:", id);

    }, [guid]);
    return (
    <View style={styles.viewstyle}>
        
       <Text style={{fontSize:24}}>details for item with id: {guid}</Text> 
    </View>)
}