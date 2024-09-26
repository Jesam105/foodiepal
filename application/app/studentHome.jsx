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

const studentHome = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const colors = [
    '#3D5A9A',
    '#BF4F4F',
    '#4F9D4F',
    '#7A4D9A',
    '#9A7A4D',
    '#4D9A7A',
    '#9A4D4D',
    '#4D4D9A',
    '#7A7A4D'
  ];

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found in AsyncStorage");
        return;
      }

      const response = await axios.post(
        "http://192.168.0.147:5000/student-data",
        { token }
      );

      if (response.data.status === "Ok") {
        setUserData(response.data.data);
      } else {
        console.log("Error message from server:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("http://192.168.0.147:5000/restaurants");
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
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserData();
    fetchRestaurants();
  }, []);

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

  return (
    <ScreenWrapper bg="white">
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
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by restaurant name"
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
                    <RestaurantLogo
                      restaurantName={item.restaurant}
                      backgroundColor={colors[index % colors.length]}
                    />
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text>No Restaurants found</Text>
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
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Confirm</Text>
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
    fontWeight: theme.colors.bold,
    color: theme.colors.black,
    marginLeft: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingRight: 20,
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
    width: wp(80),
    padding: wp(5),
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  modalText: { fontSize: hp(2.2), color: theme.colors.text, marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 5,
  },
  buttonCancel: {
    backgroundColor: theme.colors.white,
    borderWidth: 0.4,
    borderColor: "#ff5e5b",
    width: "45%",
  },
  buttonConfirm: { backgroundColor: "#ff5e5b", width: "45%" },
  buttonText: {
    fontSize: hp(2),
    color: theme.colors.black,
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
  },
  item: {
    width: '48%', // Each item takes up roughly half of the row
    margin: '1%', // Spacing between items
  },
  restaurantContainer: {
    flexGrow: 1,
  },
  grid: {
    flexDirection: 'row', // Arrange items in a row
    flexWrap: 'wrap', // Wrap to the next line if needed
    justifyContent: 'space-between', // Space out items
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.bold,
    color: theme.colors.black,
    marginBottom: 10,
  },
});
