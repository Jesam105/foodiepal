import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
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
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import jollof1 from "../assets/images/jollof1.jpeg";
import jollof2 from "../assets/images/jollof2.jpg";
import jollof3 from "../assets/images/jollof3.jpeg";
import fried1 from "../assets/images/fried1.jpeg";
import fried2 from "../assets/images/fried2.jpeg";
import fried3 from "../assets/images/fried3.jpeg";
import amala1 from "../assets/images/amala1.jpeg";
import amala2 from "../assets/images/amala2.jpeg";
import amala3 from "../assets/images/amala3.jpeg";
import semo1 from "../assets/images/semo1.jpeg";
import semo2 from "../assets/images/semo2.jpeg";
import semo3 from "../assets/images/semo3.jpeg";
import white1 from "../assets/images/white1.jpeg";
import white2 from "../assets/images/white2.jpeg";
import white3 from "../assets/images/white3.jpeg";
import Generate from "../components/Generate";

// Define a mapping of food names to images
const foodImagesMap = {
  jollof: [jollof1, jollof2, jollof3],
  fried: [fried1, fried2, fried3],
  amala: [amala1, amala2, amala3],
  semo: [semo1, semo2, semo3],
  white: [white1, white2, white3],
  // Add more mappings for other food items
};

// Define a mapping of food names to descriptions
const foodDescriptionsMap = {
  jollof: [
    `Indulge in our savory Jollof Rice, a classic West African dish made with tomatoes, peppers, and spices. Perfectly seasoned and cooked to perfection, it's a true taste of tradition.`,
    `Experience the rich, aromatic flavors of Jollof Rice. This beloved dish is slow-cooked with tomatoes, onions, and a blend of spices, offering a delightful taste that will keep you coming back for more.`,
    `Enjoy the vibrant and delicious Jollof Rice, bursting with the flavors of ripe tomatoes, peppers, and a special blend of spices. A staple in West African cuisine, it's a must-try dish!`,
  ],
  fried: [
    `Savor the crispy perfection of our Fried Rice, cooked with fresh vegetables and a touch of soy sauce for an irresistible flavor. It's a delightful side or main dish that's always a crowd-pleaser.`,
    `Enjoy our Fried Rice, expertly stir-fried with a medley of vegetables and seasonings. It's a flavorful, satisfying dish that's perfect for any meal.`,
    `Taste the crunch and flavor of our Fried Rice. Cooked with the freshest ingredients and seasoned to perfection, it's a delicious dish that will leave you wanting more.`,
  ],
  amala: [
    `Discover the rich, earthy taste of Amala, a traditional Nigerian dish made from yam flour. Served with delicious soups or stews, it's a hearty and comforting meal.`,
    `Experience the unique flavor and texture of Amala, made from finely processed yam flour. It's a versatile dish that pairs perfectly with various traditional Nigerian soups.`,
    `Indulge in the comforting taste of Amala, a staple in Nigerian cuisine. Made from yam flour, it offers a distinctive texture and flavor that's perfect with rich, savory soups.`,
  ],
  semo: [
    `Enjoy the smooth and velvety texture of Semovita, a popular Nigerian dish made from semolina flour. It's the perfect accompaniment to a variety of soups and stews.`,
    `Savor the delightful taste of Semovita, a traditional Nigerian dish made from semolina. Its smooth texture makes it an ideal pairing with hearty soups and rich stews.`,
    `Experience the comfort of Semovita, made from finely ground semolina. This classic dish pairs perfectly with your favorite Nigerian soups and is sure to satisfy.`,
  ],
  white: [
    `Savor the simplicity of White Rice, a versatile and classic dish. Lightly seasoned and perfectly cooked, it's a great complement to a variety of main courses.`,
    `Enjoy the subtle flavor and fluffy texture of White Rice. A staple in many cuisines, it's the perfect base for your favorite dishes and sauces.`,
    `Indulge in our perfectly cooked White Rice, a simple yet delicious dish that pairs well with a range of main courses and side dishes.`,
  ],
};

const addFoodMenu = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [foodImages, setFoodImages] = useState([]);
  const [generatedDescription, setGeneratedDescription] = useState(""); // New state for generated description

  const foodRef = useRef("");
  const descriptionRef = useRef("");
  const priceRef = useRef("");
  const statusRef = useRef("");

  const handlePriceSelect = (priceValue) => {
    setPrice(priceValue);
    priceRef.current = priceValue;
  };

  const handleFoodNameChange = (foodName) => {
    foodRef.current = foodName.toLowerCase();

    if (foodImagesMap[foodRef.current]) {
      setFoodImages(foodImagesMap[foodRef.current]);
    } else {
      setFoodImages([]);
    }
  };

  const handleGenerateDescription = () => {
    const foodName = foodRef.current.toLowerCase();
    const descriptions = foodDescriptionsMap[foodName];

    if (descriptions) {
      const randomDescription =
        descriptions[Math.floor(Math.random() * descriptions.length)];
      descriptionRef.current = randomDescription;
      setGeneratedDescription(randomDescription);
    } else {
      Toast.show({
        type: "error",
        text1: "No descriptions available for this food type.",
      });
    }
  };

  const Add = async () => {
    setLoading(true);
    if (
      !foodRef.current ||
      !descriptionRef.current ||
      !priceRef.current ||
      !selectedImage ||
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
      image: selectedImage,
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
        foodRef.current = "";
        descriptionRef.current = "";
        setPrice("");
        setSelectedImage(null);
        setStatus("");
        setFoodImages([]);
        setGeneratedDescription(""); // Clear the generated description
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

  const renderFoodImage = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.imageOption,
        selectedImage === item && styles.selectedImageOption,
      ]}
      onPress={() => setSelectedImage(item)}
    >
      <Image source={item} style={styles.imageOptionImage} />
    </TouchableOpacity>
  );

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
              onChangeText={handleFoodNameChange}
            />
            <Text style={styles.label}>Food Description</Text>
            <Input
              icon={<Icon name="description" size={26} strokeWidth={1.6} />}
              placeholder="Description of Food"
              value={generatedDescription} // Show the generated description
              onChangeText={(value) => (descriptionRef.current = value)}
              multiline={true}
            />
            <Generate
              title={"Generate Description"}
              onPress={handleGenerateDescription}
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
            <Text style={styles.label}>Choose a Food Image</Text>
            {foodImages.length > 0 ? (
              <FlatList
                data={foodImages}
                renderItem={renderFoodImage}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text>No images available yet. Start typing a food name!</Text>
            )}
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
  imageOption: {
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: theme.colors.text,
    borderRadius: 5,
    overflow: "hidden",
  },
  selectedImageOption: {
    borderColor: theme.colors.primary,
  },
  imageOptionImage: {
    width: 100,
    height: 100,
  },
});
