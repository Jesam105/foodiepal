import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DotIndicator } from "react-native-indicators";
import { StatusBar } from "expo-status-bar";
import { wp, hp } from "../helpers/common";
import ScreenWrapper from "../components/ScreenWrapper";
import BackButton from "../components/BackButton";
import EditButton from "../components/EditButton";
import ApproveButton from "../components/ApproveButton";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import ToastMessage from "../components/ToastMessage";
import Icon from "../assets/icons";

const foodInventory = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState({});

  const fetchFoodItems = async () => {
    setLoading(true); // Start loading state

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      // Log the token for verification
      console.log("Retrieved Token:", token);

      // Fetch food items by making an authorized request with the token
      const response = await axios.get(`http://192.168.0.147:5000/food-menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = response.data.foodItems || [];
      setFoodItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false); // Stop loading state regardless of success or error
    }
  };

  useEffect(() => {
    fetchFoodItems();
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFoodItems();
    setRefreshing(false);
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleDelete = async (id) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(`http://192.168.0.147:5000/food-menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFoodItems(); // Refresh the list after deletion
      // Show success toast message
      Toast.show({
        text1: "Food item deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting food item:", error);
      // Show error toast message
      Toast.show({
        text1: "Failed to delete food item",
        type: "error",
      });
    }
  };

  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} onPress={() => router.back()} />
          <Text style={styles.welcomeText}>View Inventory</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by food name or description"
          placeholderTextColor={theme.colors.textLight}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {loading ? (
          <DotIndicator color={theme.colors.primary} />
        ) : filteredItems.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={filteredItems}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.rowContainer}>
                  {item.image ? (
                    <Icon name="image" size={120} strokeWidth={1.6} color="white" />
                  ) : (
                    <Text>No image available</Text>
                  )}
                  <View style={styles.itemDetails}>
                    <View style={styles.itemTitleContainer}>
                      <Text style={styles.itemTitle}>{item.food}</Text>
                      <Text style={styles.itemPrice}>N{item.price}</Text>
                    </View>
                    <Text
                      style={styles.itemDescription}
                      numberOfLines={
                        expandedDescription[item._id] ? undefined : 2
                      }
                    >
                      {item.description}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleDescription(item._id)}
                      style={styles.viewButton}
                    >
                      <Text style={styles.viewButtonText}>
                        {expandedDescription[item._id] ? "Hide" : "View"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.Button}>
                  <EditButton title={"Edit"} />
                  <ApproveButton
                    title={"Delete"}
                    onPress={() => handleDelete(item._id)}
                  />
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View style={styles.noItemsContainer}>
            <Text style={styles.noItemsText}>No food items available.</Text>
            <Image
              style={styles.welcomeImage}
              resizeMode="contain"
              source={require("../assets/images/search.png")}
            />
          </View>
        )}
      </View>
      <ToastMessage swipeable={true} />
    </ScreenWrapper>
  );
};

export default foodInventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
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
    color: theme.colors.text
  },
  searchInput: {
    height: hp(6),
    borderColor: theme.colors.text,
    color: theme.colors.textLight,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: hp(2),
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    borderRadius: 5
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: wp(20),
    height: hp(10),
    resizeMode: "cover",
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.medium,
    color: theme.colors.white,
  },
  itemPrice: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  itemDescription: {
    fontSize: hp(2),
    color: "#555",
    marginTop: 5,
  },
  viewButton: {
    alignItems: "flex-start",
    marginTop: 5,
  },
  viewButtonText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  Button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  noItemsContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  noItemsText: {
    fontSize: hp(2.5),
    marginBottom: 20,
    color: "#333",
  },
  welcomeImage: {
    width: wp(100),
    height: hp(70),
    marginTop: 10,
  },
});
