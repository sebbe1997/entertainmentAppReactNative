import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native"


const styles =StyleSheet.create({

    viewstyle:{
        backgroundColor:"#effada",
        height:"100%"
    }
});

export default function details(){
    // const { id } = useLocalSearchParams();
    const router = useLocalSearchParams();
    useEffect(()=>{
        console.log(router.guid);
    },[])
    return (
    <View style={styles.viewstyle}>
        
       <Text style={{fontSize:24}}>details for item with id: {router.guid}</Text> 
    </View>)
}