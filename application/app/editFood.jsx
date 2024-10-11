import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Button } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSearchParams } from 'expo-router';

const editFood = ({ route }) => {
  const router = useRouter();
  const { foodItem } = useSearchParams();
  const [food, setFood] = useState(foodItem.food);
  const [price, setPrice] = useState(foodItem.price);
  const [description, setDescription] = useState(foodItem.description);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.put(`http://192.168.0.147:5000/food-menu/${foodItem._id}`, {
        food,
        price,
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Navigate back to inventory after a delay
      setTimeout(() => {
        router.push("/foodInventory"); // Adjust path as necessary
      }, 3000);
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={food}
        onChangeText={setFood}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default editFood;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
});
