import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Modal,
  BackHandler,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import AddButton from "../components/AddButton";
import Footer from "../components/Footer";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button1 from "../components/Button1";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const adminHome = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data after login
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const id = await AsyncStorage.getItem("id"); // Retrieve id

      if (!token || !id) {
        console.log("Token or Restaurant ID not found in AsyncStorage");
        return;
      }

      // Log the token and id
      console.log("Retrieved Token:", token);
      console.log("Retrieved Restaurant ID:", id);

      const response = await axios.post(
        "http://192.168.0.147:5000/restaurant-data",
        {
          token,
        }
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

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      // Cleanup function to remove the back handler when the screen is unfocused
      return () => backHandler.remove();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Remove the token to log out
      router.push("getStarted"); // Redirect to the login screen
    } catch (error) {
      console.log("Error logging out:", error); // Handle any errors
    }
  };

  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>
            Welcome, {userData ? userData.restaurant : "Restaurant Owner"}
          </Text>
          {/* Update the Logout button to show the modal */}
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <AddButton
              title="Add"
              iconName="plus" // Replace with the actual icon name you want to use
              iconStyle={{ color: "white" }}
              onPress={() => router.push("addFoodMenu")}
            />
            <AddButton
              title="Delete"
              iconName="delete" // Replace with the actual icon name you want to use
              iconStyle={{ color: "white" }}
            />
            <AddButton
              title="Update"
              iconName="edit" // Replace with the actual icon name you want to use
              iconStyle={{ color: "white" }}
            />
            <Button1
              title={"View Inventory"}
              iconName="viewFinder"
              onPress={() => router.push("foodInventory")}
            />
          </View>
          <Footer />
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
                    onPress={() => {
                      setModalVisible(false);
                      handleLogout();
                    }}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default adminHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  text: {
    fontSize: hp(2),
    fontWeight: theme.colors.bold,
    color: theme.colors.white,
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
  modalText: {
    fontSize: hp(2.2),
    color: theme.colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 5,
  },
  buttonCancel: {
    backgroundColor: theme.colors.white,
    borderWidth: 0.4,
    borderColor: "#ff5e5b",
    color: theme.colors.black,
    width: "45%",
  },
  buttonConfirm: {
    backgroundColor: "#ff5e5b",
    width: "45%",
  },
  buttonText: {
    fontSize: hp(2),
    color: theme.colors.black,
    alignSelf: "center",
  },
});
