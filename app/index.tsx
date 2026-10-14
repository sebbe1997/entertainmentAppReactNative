import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from "react-native";
import { useEntertainments } from "../data/useEntertainments";
import '../global.css';

export default function Index() {
  const { entertainments, loadEntertainments, isLoading, error } = useEntertainments();
  const router = useRouter();

  
  if (isLoading) {
    return (
      <View className='text-blue-500'>
        <Text>Loading...</Text>
        <Text>{entertainments.length} entertainments loaded</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className='text-red-500'>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-gray-500" scrollEnabled={true}>
      <Pressable className="m-4 p-4 rounded-lg bg-blue-400" onPress={() => router.navigate({ pathname: "/AddEntertainmentForm",params:{}} )}>
        <Text className="text-black text-center">Add Entertainment</Text>
      </Pressable>
      <Pressable className="m-4 p-4 rounded-lg bg-blue-400" onPress={() => loadEntertainments() }>
        <Text className="text-black text-center">Get Database Details</Text>
      </Pressable>
      
      {entertainments.map((entertainment, index) =>
        <Pressable key={index} onPress={() => router.navigate({ pathname: "/details", params: { guid: entertainment.id.toString() } })}>
          <View className="bg-gray-200 rounded-lg border">
            <Text className="bg-red-500 text-white p-2 rounded">{entertainment.Title}</Text>
            <Text className="p-2">{entertainment.description} </Text>
            <Text className="p-2">[{entertainment.rating}]</Text>
          </View>
        </Pressable>
      )}
    </ScrollView>
  );
}
