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
import ToastMessage from "../components/ToastMessage";

const RestaurantFood = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDescription, setExpandedDescription] = useState({});
  const [cart, setCart] = useState([]); // State for cart

  const fetchFoodItems = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id) {
        const response = await axios.get(
          `http://192.168.178.185:5000/restaurant/${id}/menu`
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

  // const fetchCart = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       const response = await axios.get("http://1192.168.178.185:5000/cart", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setCart(response.data.cart);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching cart:", error);
  //   }
  // };

  useEffect(() => {
    fetchFoodItems();
    //fetchCart(); // Fetch the cart from the backend
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const addToCart = async (item) => {
    try {
      const id = await AsyncStorage.getItem("id");

      if (!id) {
        console.log("Student ID not found in AsyncStorage");
        return;
      }

      if (id) {
        // Update cart locally (if needed)
        const updatedCart = [...cart, item];
        setCart(updatedCart);

        // Sync cart with backend
        await axios.post("http://92.168.152.245:5000/cart/add", {
          studentId: id, // Ensure this matches what the backend expects
          foodItem: {
            _id: item._id, // The ID of the food item
            food: item.food, // The name of the food
            //price: item.price, // The price of the food
            description: item.description
          },
        });

        // Show success message
        Toast.show({
          type: "success",
          text1: `${item.food} added to cart!`,
        });
      } else {
        console.error("No student ID found, unable to add to cart.");
      }
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const filteredItems = foodItems.filter((item) =>
    item.food.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <BackButton router={router} onPress={() => router.back()} />
          <Text style={styles.welcomeText}>Food Items</Text>
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
            placeholderTextColor={theme.colors.textLight}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {loading ? (
            <DotIndicator color={theme.colors.primary} />
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <View key={item._id} style={styles.foodItem}>
                {item.image ? (
                  <View style={styles.imageLogo}>
                    <Icon
                      name="image"
                      size={120}
                      strokeWidth={1.6}
                      color={theme.colors.white}
                    />
                  </View>
                ) : (
                  <Text>No image available</Text>
                )}

                <View style={styles.foodDetails}>
                  <View style={styles.foodHeader}>
                    <Text style={styles.foodName}>{item.food}</Text>
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
                    <Text
                      style={[
                        styles.foodStatus,
                        {
                          color:
                            item.status === "unavailable"
                              ? theme.colors.rose
                              : theme.colors.green,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                    <TouchableOpacity
                      style={styles.addToCartButton}
                      onPress={() => addToCart(item)} // Call addToCart on press
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
      <ToastMessage swipeable={true} />
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
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    borderRadius: 8,
  },
  foodDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    marginTop: 10,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.white,
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
    color: theme.colors.gray,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: hp(1),
  },
  welcomeText: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cartContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  cartBadge: {
    position: "absolute",
    right: -5,
    top: -10,
    backgroundColor: theme.colors.rose,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  priceAndIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    padding: 5,
    width: "25%",
    alignItems: "center",
    borderRadius: 5,
  },
  imageLogo: {
    marginTop: 10,
  },
});
