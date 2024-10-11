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
import Toast from "react-native-toast-message";
import axios from "axios";
import Generate from "../components/Generate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import ToastMessage from "../components/ToastMessage";

// Mapping of food names to images
const foodImagesMap = {
  jollof: [
    require("../assets/images/jollof1.jpeg"),
    require("../assets/images/jollof2.jpg"),
    require("../assets/images/jollof3.jpeg"),
  ],
  amala: [
    require("../assets/images/amala3.jpeg"),
    require("../assets/images/amala1.jpeg"),
    require("../assets/images/amala2.jpeg"),
  ],
  friedrice: [
    require("../assets/images/fried1.jpeg"),
    require("../assets/images/fried2.jpeg"),
    require("../assets/images/fried3.jpeg"),
  ],
  eba: [
    require("../assets/images/eba1.jpeg"),
    require("../assets/images/eba2.jpeg"),
    require("../assets/images/eba3.jpeg"),
  ],
  semo: [
    require("../assets/images/semo1.jpeg"),
    require("../assets/images/semo2.jpeg"),
    require("../assets/images/semo3.jpeg"),
  ],
  whiterice: [
    require("../assets/images/white1.jpeg"),
    require("../assets/images/white2.jpeg"),
    require("../assets/images/white3.jpeg"),
  ],
  // Add other food names and their corresponding images here
};

// Mapping of food names to descriptions
const foodDescriptionsMap = {
  jollof:
    "Jollof rice is a one-pot dish made with tomatoes, onions, and peppers, known for its rich and savory flavor.",
  friedrice:
    "Fried rice is a versatile dish made with rice stir-fried with vegetables, soy sauce, and various proteins like chicken, shrimp, or eggs. It offers a blend of savory flavors and is often enjoyed as a standalone meal or a side dish.",
  amala:
    "Amala is a soft, dark Nigerian swallow made from yam flour, plantain flour, or cassava flour. It has a distinct flavor and is often paired with rich, spicy soups such as ewedu, gbegiri, or okra soup.",
  semo: "Semo is a smooth, dough-like Nigerian dish made from processed semolina or wheat flour mixed with hot water. It’s often served with traditional soups like egusi or vegetable soup, providing a perfect complement to bold, flavorful stews.",
  eba: "Eba is a staple Nigerian dish made from garri (ground cassava) mixed with hot water to form a dough-like consistency. It's typically eaten with a variety of rich, hearty soups such as egusi, okra, or vegetable soup.",
  // Add other food descriptions here
};

const addFoodMenu = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null); // Selected image
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [availableImages, setAvailableImages] = useState([]); // Images for the food typed
  const [selectedImage, setSelectedImage] = useState(null);
  const priceRef = useRef("");
  const statusRef = useRef("");
  const [id, setid] = useState(null);

  useEffect(() => {
    const getid = async () => {
      const id = await AsyncStorage.getItem("id");
      setid(id);
    };

    getid();
  }, []);

  const handlePriceSelect = (priceValue) => {
    setPrice(priceValue);
    priceRef.current = priceValue;
  };

  const handleFoodNameChange = (name) => {
    setFoodName(name);
    // Set available images based on the food name
    const images = foodImagesMap[name.toLowerCase()] || [];
    setAvailableImages(images);
  };

  const handleImageSelect = (imgUri) => {
    setImage(imgUri); // Set selected image
    setSelectedImage(imgUri);
  };

  const generateDescription = () => {
    const desc = foodDescriptionsMap[foodName.toLowerCase()];
    if (desc) {
      setDescription(desc);
    } else {
      setDescription("No description available for this food item.");
      Toast.show({
        type: "error",
        text1: "No description available for this food item.",
      });
    }
  };

  const Add = async () => {
    setLoading(true);
    
    // Check if all fields are filled
    if (!foodName || !description || !priceRef.current || !image || !statusRef.current) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }
  
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
  
    if (!id) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Restaurant identification missing",
      });
      return;
    }
  
    const foodMenuData = {
      restaurant: id,
      food: foodName,
      description,
      price: priceRef.current,
      image, // Use the selected image
      status: statusRef.current,
    };
  
    try {
      const res = await axios.post(
        "http://192.168.0.147:5000/food-menu",
        foodMenuData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Check for success response
      if (res.data.status === "ok") {
        Toast.show({
          type: "success",
          text1: "Added Successfully",
        });
        setLoading(false);
        // Clear the form fields
        setFoodName("");
        setDescription("");
        setPrice("");
        setImage(null);
        setSelectedImage(null);
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
      // Check for duplicate food item error (409 Conflict)
      if (e.response && e.response.status === 409) {
        Toast.show({
          type: "error",
          text1: "Food item already exists",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An error occurred",
        });
      }
    }
  };
  
  

  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />

      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} onPress={() => router.back()} />
          <Text style={styles.welcomeText}>Add Food Item</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Text style={styles.label}>Food Name</Text>
            <Input
              icon={<Icon name="home" size={26} strokeWidth={1.6} />}
              placeholder="Name of Food"
              value={foodName}
              onChangeText={handleFoodNameChange} // Update images when food name changes
            />
            <Text style={styles.label}>Select Food Image</Text>
            <View style={styles.imageContainer}>
              {availableImages.map((imgUri, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleImageSelect(imgUri)}
                  style={styles.imageOption}
                >
                  <Image source={imgUri} style={styles.image} />
                  {selectedImage === imgUri && (
                    <View style={styles.selectedOverlay}>
                      <Icon
                        name="tick"
                        size={26}
                        strokeWidth={1.6}
                        color="white"
                      />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Food Description</Text>
            <Input
              icon={<Icon name="description" size={26} strokeWidth={1.6} />}
              placeholder="Description of Food"
              value={description}
              onChangeText={(value) => setDescription(value)}
            />
            <Generate
              title="Generate Description"
              onPress={generateDescription}
              disabled={!foodName}
            />

            <Text style={styles.label}>Food Price</Text>
            <Input
              icon={<Icon name="currency" size={26} strokeWidth={1.6} />}
              placeholder="Minimum Food Price"
              value={price}
              onChangeText={(value) => {
                const numericValue = value.replace(/[^0-9.]/g, ""); // Only allow numbers and decimal
                setPrice(numericValue);
                priceRef.current = numericValue;
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

            <Text style={styles.label}>Food Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => {
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
        <ToastMessage swipeable={true} />
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
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  form: {
    gap: 15,
  },
  label: {
    color: theme.colors.white,
    fontSize: hp(2.2),
  },
  imageContainer: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  imageOption: {
    width: 100,
    height: 100,
    borderRadius: 10,
    position: "relative", // Needed for overlay
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primary,
    opacity: 0.6, // Adjust opacity to control the cover effect
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center", // Center tick icon
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.input,
    height: 56,
  },
  picker: {
    flex: 1,
    color: theme.colors.text,
  },
});
