import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  // ActivityIndicator, // Import the ActivityIndicator component
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import axios from "axios";
import { theme } from "../constants/theme";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";

const foodInventory = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get("http://192.168.48.185:5000/food-menu");
      setFoodItems(response.data);
      setFilteredItems(response.data); // Initialize filtered items with all food items
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching food items:", error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  useEffect(() => {
    fetchFoodItems(); // Fetch food items when the component mounts
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = foodItems.filter(
      (item) =>
        item.food.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} onPress={() => router.back()} />
          <Text style={styles.welcomeText}>View Inventory</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by food name or description"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {loading ? ( // Show the loader while loading
          <DotIndicator color={theme.colors.primary} />
        ) : filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{item.food}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
                <Text style={styles.itemStatus}>{item.status}</Text>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }} // Assuming the image URL is correct
                    style={styles.itemImage}
                  />
                ) : (
                  <Text>No image available</Text>
                )}
              </View>
            )}
          />
        ) : (
          <Text>No food items available.</Text>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default foodInventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingRight: 80,
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: theme.fonts.medium,
    marginBottom: 10,
  },
  searchInput: {
    height: hp(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: hp(2),
  },
  itemContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  itemTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: hp(2),
    color: "#555",
  },
  itemPrice: {
    fontSize: hp(2),
    color: "#000",
  },
  itemStatus: {
    fontSize: hp(2),
    color: theme.colors.green,
  },
  itemImage: {
    width: wp(80),
    height: hp(20),
    resizeMode: "cover",
    borderRadius: 5,
    marginTop: 10,
  },
});
