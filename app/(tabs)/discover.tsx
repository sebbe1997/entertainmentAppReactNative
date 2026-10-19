import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TextInput, View } from "react-native";

type FormValues = {
  search: string;
};

export default function Discover() {
  const { control } = useForm<FormValues>();

  return (
    <ScrollView className="flex-1 bg-gray-500">
      <Text className="text-white text-2xl font-bold">Discover Page</Text>

      <View className="m-4 p-4 rounded-lg bg-blue-400">
        <Controller
          name="search"
          control={control}
          rules={{
            required: false,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="text-black text-center"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Search..."
            />
          )}
        />

        <View className="m-4 p-4 rounded-lg bg-blue-400">
          <Text className="text-black text-center">Welcome to the Discover Page</Text>
          <Text className="text-black text-center">Here you can discover new entertainment options and add them to your collection.</Text>
          <Text className="text-black text-center text-lg font-bold">TBA</Text>
        </View>

      </View>
    </ScrollView>
  );
}