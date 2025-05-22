import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../components/BackButton";
import ToastMessage from "../components/ToastMessage";
import ScreenWrapper from "../components/ScreenWrapper";
import { DotIndicator } from "react-native-indicators";
import axios from "axios";
import { useRouter } from "expo-router";

const ViewCart = () => {
  const router = useRouter();
  const [cartItems, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCart = async () => {
    setLoading(true); // Start loading
    try {
      const id = await AsyncStorage.getItem("id");

      if (!id) {
        console.log("Student ID not found in AsyncStorage");
        setLoading(false); // Stop loading if no ID found
        return;
      }

      console.log("Retrieved Student ID:", id);
      const response = await axios.get(`http://192.168.178.185:5000/cart/${id}`);
      console.log("Fetched Cart Response:", response.data);

      setCart(response.data.cart); // Update cart items
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  };

  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} onPress={() => router.back()} />
          <Text style={styles.welcomeText}>Cart Items</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            // Loading spinner while data is being fetched
            <View style={styles.loadingContainer}>
              <DotIndicator color={theme.colors.primary} />
            </View>
          ) : cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <View key={index} style={styles.cartItem}>
                <Text style={styles.foodName}>{item.food}</Text>
                <Text style={styles.foodPrice}>{item.price}</Text>
                <Text style={styles.foodDescription}>{item.description}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noItemsContainer}>
              <Text style={styles.noItemsText}>Your cart is empty.</Text>
            </View>
          )}
        </ScrollView>
        <ToastMessage swipeable={true} />
      </View>
    </ScreenWrapper>
  );
};

export default ViewCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
    paddingHorizontal: wp(5),
    paddingBottom: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  headerText: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  cartItem: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    borderRadius: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  foodDescription: {
    color: theme.colors.textLight,
    marginTop: 5,
  },
  noItemsContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  noItemsText: {
    fontSize: hp(2.5),
    color: theme.colors.textLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingRight: 80,
  },
  welcomeText: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "bold",
    paddingRight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
