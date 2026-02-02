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
        GetEntertainmentsById(id).then((data) => {
            setEntertainment(data as Entertainment);
        });
        

    }, [guid]);
    return (
    <View className="bg-blue-400 h-full">
        
       <Text className="text-white text-lg p-3">Title {entertainment.Title}</Text>
       <Text className="text-white text-lg p-3">Description {entertainment.description}</Text>
       <Text className="text-white text-lg p-3">rating: {entertainment.rating}</Text> 
    </View>)
}