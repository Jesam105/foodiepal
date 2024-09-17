import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Input from "../components/Input";
import Icon from "../assets/icons";
import Button from "../components/Button";
import Footer from "../components/Footer";
import PriceButton from "../components/PriceButton";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import axios from "axios";

const addFoodMenu = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);
  const [foodItems, setFoodItems] = useState([]); // State to hold fetched food items
  const foodRef = useRef("");
  const descriptionRef = useRef("");
  const priceRef = useRef("");
  const statusRef = useRef("");

  const handlePriceSelect = (priceValue) => {
    setPrice(priceValue);
    priceRef.current = priceValue;
  };

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets[0].uri;
      setImage(imageUri);
      console.log(imageUri);
    }
  };

  const Add = async () => {
    setLoading(true);
    if (
      !foodRef.current ||
      !descriptionRef.current || // Ensure all refs are correctly referenced
      !priceRef.current ||
      !image ||
      !statusRef.current
    ) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }

    const foodMenuData = {
      food: foodRef.current,
      description: descriptionRef.current,
      price: priceRef.current,
      image: image,
      status: statusRef.current,
    };

    try {
      const res = await axios.post(
        "http://192.168.0.147:5000/food-menu",
        foodMenuData
      );

      if (res.data.status === "ok") {
        Toast.show({
          type: "success",
          text1: "Added Successfully",
        });
        setLoading(false);
        // Clear the form fields
        foodRef.current = "";
        descriptionRef.current = "";
        setPrice("");
        setImage(null);
        setStatus("");
      } else {
        Toast.show({
          type: "error",
          text1: JSON.stringify(res.data),
        });
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "An error occurred",
      });
      console.log(e);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} onPress={() => router.back()} />
          <Text style={styles.welcomeText}>Add Food Item</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill in the details to add food item to inventory
            </Text>
            <Text style={styles.label}>Food Name</Text>
            <Input
              icon={<Icon name="home" size={26} strokeWidth={1.6} />}
              placeholder="Name of Food"
              onChangeText={(value) => (foodRef.current = value)}
            />
            <Text style={styles.label}>Food Description</Text>
            <Input
              icon={<Icon name="description" size={26} strokeWidth={1.6} />}
              placeholder="Description of Food"
              onChangeText={(value) => (descriptionRef.current = value)}
            />
            <Text style={styles.label}>Food Price</Text>
            <Input
              icon={<Icon name="currency" size={26} strokeWidth={1.6} />}
              placeholder="Price of Food"
              value={price}
              onChangeText={(value) => {
                setPrice(value);
                priceRef.current = value;
              }}
            />
            <View style={styles.buttonContainer}>
              <PriceButton
                title={"500.00"}
                onPress={() => handlePriceSelect("500.00")}
              />
              <PriceButton
                title={"1000.00"}
                onPress={() => handlePriceSelect("1000.00")}
              />
              <PriceButton
                title={"2000.00"}
                onPress={() => handlePriceSelect("2000.00")}
              />
            </View>
            <Text style={styles.label}>Food Image</Text>
            <Pressable style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <Text style={styles.imagePickerText}>Pick an image</Text>
              )}
            </Pressable>
            <Text style={styles.label}>Food Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue, itemIndex) => {
                  setStatus(itemValue);
                  statusRef.current = itemValue;
                }}
                style={styles.picker}
              >
                <Picker.Item label="-Select Food Status-" value="" />
                <Picker.Item label="Available" value="available" />
                <Picker.Item label="Unavailable" value="unavailable" />
              </Picker>
            </View>

            <Button title={"Add"} loading={loading} onPress={Add} />
          </View>
          <Footer />
        </ScrollView>
        <Toast swipeable={true} />
      </View>
    </ScreenWrapper>
  );
};

export default addFoodMenu;

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
    color: theme.colors.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    gap: 6,
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: hp(2.0),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    borderRadius: 5,
    borderWidth: 0.4,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: hp(7),
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
  },
  imagePicker: {
    width: "100%",
    height: hp(20),
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    borderWidth: 0.4,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePickerText: {
    color: theme.colors.text,
    fontSize: hp(2),
    alignSelf: "center",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
});
