import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  BackHandler,
  Alert,
  ScrollView,
  RefreshControl,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import Footer from "../components/Footer";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import RestaurantLogo from "../components/RestaurantLogo";
import { DotIndicator } from "react-native-indicators";
import RestaurantQuestion from "../components/RestaurantQuestion";
import Icon from "../assets/icons";

const studentHome = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [likedRestaurants, setLikedRestaurants] = useState({});

  const colors = [
    ["#4c669f", "#3b5998", "#192f6a"], // Original blue gradient
    ["#243B55", "#2C5364", "#3E4A59"], // Dark blue and slate tones
    ["#1C1C2D", "#4C4C6D", "#282B5B"], // Charcoal blue gradient
    ["#283048", "#3A539B", "#4B79A1"], // Steel blue to navy
  ];

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const id = await AsyncStorage.getItem("id");
      if (!token || !id) {
        console.log("Token or Student ID not found in AsyncStorage");
        return;
      }
      // Log the token and studentId
      console.log("Retrieved Token:", token);
      console.log("Retrieved Student ID:", id);
      const response = await axios.post(
        "http://192.168.178.185:5000/student-data",
        { token }
      );

      if (response.data.status === "Ok") {
        setUserData(response.data.data);
      } else {
        console.log("Error message from server:", response.data.message);
      }
    } catch (error) {
      // Check if the error is a 401 (Unauthorized) indicating token expiration
      if (error.response && error.response.status === 401) {
        console.log("Token expired or invalid, logging out...");
        await handleLogout(); // Trigger logout if token is expired
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("http://192.168.178.185:5000/restaurants");
      setRestaurants(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRestaurants();
    await fetchUserData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserData();
    fetchRestaurants();
  }, []);

  const handleRestaurantPress = async (id) => {
    try {
      await AsyncStorage.setItem("id", id);
      router.push("restaurantFood"); // Navigate to the restaurant food screen
    } catch (error) {
      console.error("Error storing restaurant ID:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.push("getStarted");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = restaurants.filter((item) =>
      item.restaurant.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleHeartPress = (restaurantId) => {
    setLikedRestaurants((prevState) => ({
      ...prevState,
      [restaurantId]: !prevState[restaurantId], // Toggle like state
    }));
  };

  return (
    <ScreenWrapper bg="black">
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.text}>
              Welcome, {userData ? userData.name : "Student"}
            </Text>
            <Pressable onPress={() => setModalVisible(true)}>
              {/* <Text style={styles.logoutText}>Logout</Text> */}
              <Icon name="app" size={20} strokeWidth={1.6} />
            </Pressable>
          </View>
          <RestaurantQuestion
            question="Where would you like to eat today?"
            colors={["#4c669f", "#3b5998", "#192f6a"]} // Gradient colors
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by restaurant name"
            placeholderTextColor={theme.colors.textLight} // Change this if needed
            value={searchQuery}
            onChangeText={handleSearch}
          />

          {/* Restaurant List */}
          {loading ? (
            <DotIndicator color={theme.colors.primary} />
          ) : filteredItems.length > 0 ? (
            <View style={styles.restaurantContainer}>
              <Text style={styles.title}>Restaurants</Text>
              <View style={styles.grid}>
                {filteredItems.map((item, index) => (
                  <View key={item._id} style={styles.item}>
                    <Pressable onPress={() => handleRestaurantPress(item._id)}>
                      <RestaurantLogo
                        restaurantName={item.restaurant}
                        colors={colors[index % colors.length]} // Assign gradient based on index
                      />
                      <Pressable
                        onPress={() => handleHeartPress(item._id)}
                        style={[
                          styles.heartIcon,
                          likedRestaurants[item._id] && styles.heartIconLiked, // Conditionally apply red background if liked
                        ]}
                      >
                        <Icon
                          name={
                            likedRestaurants[item._id] ? "heartSolid" : "heart"
                          }
                          size={20}
                          strokeWidth={1.6}
                          color={
                            likedRestaurants[item._id] ? "#ff5e5b" : "gray"
                          } // Dynamic color based on like state
                        />
                      </Pressable>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.noItemsContainer}>
              <Text style={styles.noItemsText}>No restaurant found.</Text>
              <Image
                style={styles.welcomeImage}
                resizeMode="contain"
                source={require("../assets/images/search.png")}
              />
            </View>
          )}

          <Footer />
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>What would you like to do?</Text>
            <View style={styles.rowContainer}>
              {/* Cart Button */}
              <Pressable
                style={[styles.button, styles.buttonCart]}
                onPress={() => {
                  setModalVisible(false); // Close modal
                  router.push("viewCart"); // Navigate to Cart
                }}
              >
                <Icon name="cart" size={20} strokeWidth={1.6} color="#fff" />
                <Text style={styles.buttonText}>View Cart</Text>
              </Pressable>

              {/* Logout Button */}
              <Pressable
                style={[styles.button, styles.buttonLogout]}
                onPress={handleLogout}
              >
                <Icon name="logout" size={20} strokeWidth={1.6} color="#fff" />
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>

              {/* Favourites Button */}
              <Pressable style={[styles.button, styles.buttonFavourites]}>
                <Icon name="heart" size={20} strokeWidth={1.6} color="#fff" />
                <Text style={styles.buttonText}>Favourites</Text>
              </Pressable>
            </View>

            {/* Buttons in the same row */}
            <View style={styles.rowContainer}>
              {/* Wallet Button */}
              <Pressable style={[styles.button, styles.buttonWallet]} >
                <Icon name="wallet" size={20} strokeWidth={1.6} color="#fff" />
                <Text style={styles.buttonText}>Wallet</Text>
              </Pressable>

              {/* Rewview Button */}
              <Pressable style={[styles.button, styles.buttonReview]}>
                <Icon name="review" size={20} strokeWidth={1.6} color="#fff" />
                <Text style={styles.buttonText}>Review</Text>
              </Pressable>

              {/* Cancel Button */}
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="cancel" size={20} strokeWidth={1.6} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
            <View style={styles.rowContainer}>
              {/* Cancel Button */}
              <Pressable
                style={[styles.button, styles.buttonBell]}
              >
                <Icon name="notification" size={20} strokeWidth={1.6} color="#fff" />
                <Text style={styles.buttonText}>Notifications</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default studentHome;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // Allow ScrollView to grow
    paddingHorizontal: wp(5),
    paddingBottom: 20, // Add some bottom padding for better appearance
  },
  container: { flexGrow: 1 },
  text: {
    fontSize: hp(2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.white,
    marginLeft: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingRight: 10,
  },
  logoutText: {
    fontSize: hp(2.5),
    color: "#ff5e5b",
    fontWeight: theme.fonts.bold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: wp(95),
    padding: wp(5),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    elevation: 5,
  },
  modalText: { fontSize: hp(2.2), color: theme.colors.white, marginBottom: 20 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 5,
  },
  buttonCancel: {
    backgroundColor: "#f7b733",
    borderWidth: 0.4,
    width: "30%",
    alignItems: "center",
  },
  //buttonConfirm: { backgroundColor: "#ff5e5b", width: "45%" },
  buttonText: {
    fontSize: hp(1.5),
    color: theme.colors.white,
    alignSelf: "center",
  },
  searchInput: {
    height: hp(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: hp(2),
    width: "94%",
    alignSelf: "center",
    color: theme.colors.white,
  },

  item: {
    width: "48%", // Each item takes up roughly half of the row
    margin: "1%", // Spacing between items
  },
  restaurantContainer: {
    flexGrow: 1,
  },
  grid: {
    flexDirection: "row", // Arrange items in a row
    flexWrap: "wrap", // Wrap to the next line if needed
    justifyContent: "space-between", // Space out items
  },
  title: {
    fontSize: hp(2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.white,
    marginBottom: 5,
    paddingLeft: 10,
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
  buttonCart: {
    backgroundColor: "#4CAF50", // Green for cart
    width: "30%",
    alignItems: "center",
  },
  buttonLogout: {
    backgroundColor: "#ff5e5b", // Red for logout
    width: "30%",
    alignItems: "center",
  },
  buttonFavourites: {
    backgroundColor: theme.colors.primary, // Red for logout
    width: "30%",
    alignItems: "center",
  },
  buttonWallet: {
    backgroundColor: "#302b63", // Red for logout
    width: "30%",
    alignItems: "center",
  },
  buttonReview: {
    backgroundColor: "#00b09b", // Red for logout
    width: "30%",
    alignItems: "center",
  },
  buttonBell: {
    backgroundColor: "#0575E6", // Red for logout
    width: "100%",
    alignItems: "center",
  },
  restaurantCard: {
    position: "relative", // Allows positioning the heart icon relative to the card
  },
  heartIcon: {
    position: "absolute",
    top: 25, // Adjust as needed
    right: 20, // Adjust as needed
    padding: 5, // Optional padding for a better look
    backgroundColor: "transparent", // Default background
    borderRadius: 15, // For a rounded look
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Align buttons in a row
    marginTop: 15, // Space between button groups
  },

  button: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 5,
    width: "45%", // Adjust width to fit both buttons in a row
  },
  // heartIconLiked: {
  //   backgroundColor: "#ff5e5b", // Change to red when liked
  // },
});
