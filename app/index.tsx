import { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from 'expo-router';
interface Entertainment{
  id:String
  Title:String,
  description?:String
  rating:Number
}

export default function Index() {
 

  const [text, setText] = useState<string>("");
  const [data,setdata] = useState<Entertainment[]>( [{id:"1",Title:"test 1", description:"test desc",rating:4},{id:"2",Title:"test 2", description:"test 2 desc",rating:5}]);
  
  const router = useRouter();

  function onSubmit(text:string){
    console.log(text);
    //  let parsedText = parseInt(text);
  //   data.push(parsedText);
  //  setdata([...data]);
  }
  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={true} >
      <TextInput placeholder="add a number..." value={text} onChangeText={setText} style={styles.inputstyle}/>
      
      <View style={styles.buttonview}>

        <Button title="Add" color={"#2532af"} onPress={()=> onSubmit(text)}></Button>
      </View>
      
      {data.map((number,index) =>
         <Pressable key={index} onPress={()=> router.navigate({pathname:"/details",params:{guid:number.id.toString()}})} >
          <View style={{width:"auto"}}>

           <Text  style={styles.datastyle}>{number.id} {number.Title}</Text>
          </View>
         </Pressable>
        
      )}
     
    
    </ScrollView>
  );
}
 const styles = StyleSheet.create({
    container:{
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    },

    datastyle:{
      fontSize:32,
    },
    inputstyle:{
      backgroundColor:"#363635",
      color:"white",
      width:"100%",
      borderWidth: 5,
      borderColor:"#ffaaff"
    },
    buttonstyle:{
      backgroundColor:"#eaeaea",
      color:"white"
    },
    buttonview:{
      width:"100%",
      height:58
    }
  });