import { Controller, useForm } from 'react-hook-form';
import { Button, Text, TextInput, View } from "react-native";
import { useEntertainments } from "../data/useEntertainments";
import { Entertainment } from "../types/entertainment";

export default function AddEntertainmentForm(){

    const { addEntertainment } = useEntertainments();

    const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Entertainment>();

    const onSubmit = (data: Entertainment) =>{ console.log(data)}

    
    return <View className="p-4 bg-gray-300 h-full">
        <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput className="bg-gray-400 mb-4 rounded"
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            
          />
        )}
        name="Title"
      />

      <Controller 
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput className="bg-gray-400 mb-4 rounded"
            placeholder="Description"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            
          />
        )}
        name="description"
      />

       <Controller  
        control={control}
        defaultValue = {0}
        rules={{
          min: 0,
          max: 10,
        }}
        render={({ field: { onChange, onBlur, value, }, fieldState:{error}}) => (
          <TextInput className="bg-gray-400 mb-4 rounded "
            placeholder="Rating"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value?.toString() ?? ""}
            keyboardType="numeric"
            
          />
        )}
        name="rating"
      />
      <Text> {errors.Title?.message} </Text>
       <Text> {errors.description?.message} </Text>
        <Text> {errors.rating?.message} </Text>
      <View className="mt-4">

        <Button  title="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
    

        
    </View>
}


 