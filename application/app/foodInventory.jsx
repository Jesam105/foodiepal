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
        setLoading(false); // Stop loading state
        return;
      }

      const response = await axios.get("http://192.168.0.147:5000/food-menu", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = response.data || [];
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
                  <ApproveButton title={"Approve"} />
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
    fontWeight: theme.fonts.medium,
    color: "#000",
  },
  itemPrice: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: "#000",
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
