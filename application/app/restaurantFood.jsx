import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { DotIndicator } from "react-native-indicators";
import FoodLogo from "../components/FoodLogo";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Icon from "../assets/icons";

const RestaurantFood = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [cart, setCart] = useState([]); // State for cart
  const colorsArray = [
    ["#4c669f", "#3b5998", "#192f6a"], // Original blue gradient
    ["#243B55", "#2C5364", "#3E4A59"], // Dark blue and slate tones
    ["#1C1C2D", "#4C4C6D", "#282B5B"], // Charcoal blue gradient
    ["#283048", "#3A539B", "#4B79A1"], // Steel blue to navy
  ];

  const fetchFoodItems = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id) {
        const response = await axios.get(
          `http://192.168.0.147:5000/restaurant/${id}/menu`
        );
        setFoodItems(response.data.foodItems);
      }
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFoodItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = foodItems.filter((item) =>
      item.food.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
    //alert(`${item.food} added to cart!`); // Alert to confirm addition
    Toast.show({
      type: "success",
      text1: `${item.food} added to cart!`,
    });
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <BackButton router={router} onPress={() => router.back()} />
          <Text style={styles.welcomeText}>View Food Items</Text>
          <View style={styles.cartContainer}>
          <Pressable onPress={() => router.push("viewCart")}>
            <Icon name="cart" size={26} strokeWidth={1.6} />
            {cart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cart.length}</Text>
                </View>
            )}
            </Pressable>
          </View>
        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by food name"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {loading ? (
            <DotIndicator color={theme.colors.primary} />
          ) : foodItems.length > 0 ? (
            foodItems.map((item, index) => (
              <View key={item._id} style={styles.foodItem}>
                <FoodLogo
                  style={styles.foodLogo}
                  foodName={item.food}
                  colors={colorsArray[index % colorsArray.length]} // Use gradient colors
                />
                <View style={styles.foodDetails}>
                  <View style={styles.foodHeader}>
                    <Text style={styles.foodName}>{item.food}</Text>
                    <Text style={styles.foodStatus}>{item.status}</Text>
                  </View>
                  <Text
                    style={styles.foodDescription}
                    numberOfLines={
                      expandedDescription[item._id] ? undefined : 2
                    }
                  >
                    {item.description}
                  </Text>
                  <View style={styles.priceAndIconContainer}>
                    <Text style={styles.foodPrice}>N {item.price}</Text>
                    <TouchableOpacity
                      style={styles.addToCartButton}
                      onPress={() => addToCart(item)}
                    >
                      <Icon
                        name="plus"
                        size={20}
                        strokeWidth={1.6}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noItemsContainer}>
              <Text style={styles.noItemsText}>No food item found.</Text>
              <Image
                style={styles.welcomeImage}
                resizeMode="contain"
                source={require("../assets/images/search.png")}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <Toast swipeable={true} />
    </ScreenWrapper>
  );
};

export default RestaurantFood;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(5),
    paddingBottom: 20,
  },
  container: { flexGrow: 1 },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingRight: 10,
    paddingBottom: 15,
    paddingTop: 5,
    backgroundColor: theme.colors.gray,
    borderRadius: 8,
  },
  foodDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    marginTop: 15,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.black,
  },
  foodStatus: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.green,
  },
  foodDescription: {
    color: theme.colors.textLight,
    marginTop: 5,
  },
  searchInput: {
    height: hp(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 15,
    fontSize: hp(2),
    width: "100%",
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
  viewButton: {
    alignItems: "flex-start",
    marginTop: 5,
  },
  viewButtonText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingRight: 80,
    gap: 33,
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: theme.fonts.medium,
    marginBottom: 10,
    marginRight: 30,
  },
  foodLogo: {
    height: 60,
    width: 60,
  },
  priceAndIconContainer: {
    flexDirection: "row", // Aligns the price and icon horizontally
    alignItems: "center", // Vertically centers both the price and the icon
    justifyContent: "space-between", // Creates space between the price and the icon
    marginTop: 2, // Adds spacing above the container
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary, // Button background color
    padding: 10, // Padding around the icon
    borderRadius: 5, // Circular button
    alignItems: "center",
    justifyContent: "center",
    width: wp(5), // Set a width to match the button size
    height: wp(5), // Set height to match width for a perfect circle
  },

  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cartContainer: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    right: -10, // Adjust the position of the badge
    top: -5, // Adjust the vertical position
    backgroundColor: theme.colors.rose, // Badge background color
    borderRadius: 10, // Fully rounded badge
    width: 20, // Badge width
    height: 20, // Badge height
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff", // White text
    fontSize: 12, // Smaller text size
    fontWeight: "bold",
  },
});
