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
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import axios from "axios";
import { theme } from "../constants/theme";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DotIndicator } from "react-native-indicators";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the arrow icon
import Icon from "../assets/icons";
import EditButton from "../components/EditButton";
import ApproveButton from "../components/ApproveButton";

const foodInventory = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFoodItems = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://192.168.0.147:5000/food-menu", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = response.data || [];
      setFoodItems(items);
      setFilteredItems(items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching food items:", error);
      setLoading(false);
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
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                    />
                  ) : (
                    <Text>No image available</Text>
                  )}
                  <View style={styles.itemDetails}>
                    <View style={styles.itemTitleContainer}>
                      <Text style={styles.itemTitle}>{item.food}</Text>
                      <Text style={styles.itemPrice}>N{item.price}</Text>
                    </View>
                    <Text style={styles.itemDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.Button}>
                  <EditButton title={"Edit"} />
                  <ApproveButton title={"Approve"} />
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
    paddingBottom: 10,
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
    fontWeight: "bold",
    color: "#000",
  },
  itemPrice: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#000",
  },
  itemDescription: {
    fontSize: hp(2),
    color: "#555",
    marginTop: 5,
  },
  arrowContainer: {
    marginTop: 1,
    alignItems: "flex-end",
  },
  Button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  }
});
