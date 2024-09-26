import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
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
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import axios from "axios";
import Generate from "../components/Generate";

// Mapping of food names to descriptions
const foodDescriptionsMap = {
  jollof:
    "Jollof rice is a one-pot dish made with tomatoes, onions, and peppers, known for its rich and savory flavor.",
  fried:
    "Fried rice is a delicious dish made with stir-fried rice, vegetables, and a touch of soy sauce.",
  pizza:
    "Pizza is a flatbread topped with tomato sauce, cheese, and various toppings, baked until golden and bubbly.",
  egusi:
    "Egusi soup is a thick, hearty soup made from ground melon seeds, often enjoyed with pounded yam or fufu.",
  moiMoi:
    "Moi Moi is a steamed bean pudding made from blended black-eyed peas, peppers, and spices, served as a side dish.",
  poundedYam:
    "Pounded yam is a starchy dish made from boiled yam that is pounded until smooth and stretchy, often served with soups.",
  pepperSoup:
    "Pepper soup is a spicy, broth-based dish typically made with fish or meat, flavored with spices and herbs.",
  suya:
    "Suya is a spicy meat skewer, marinated with a blend of spices and grilled to perfection, often served with onions and tomatoes.",
  akara:
    "Akara are deep-fried bean cakes made from blended black-eyed peas, spices, and onions, crispy on the outside and soft inside.",
  nshima:
    "Nshima is a traditional staple made from maize flour, cooked to a dough-like consistency and served with various stews.",
  amala:
    "Amala is a smooth, stretchy dish made from yam flour or cassava flour, often paired with rich, flavorful soups.",
  efoRiro:
    "Efo Riro is a vegetable soup made with leafy greens, peppers, and a mix of proteins, known for its vibrant color and taste.",
  banga:
    "Banga soup is a rich, flavorful soup made from palm nut extract, typically served with starches like pounded yam.",
  riceAndBeans:
    "Rice and beans is a nutritious dish combining rice and beans, cooked together with spices for a hearty meal.",
  chinchin:
    "Chin chin are crunchy, sweet snacks made from fried dough, enjoyed as a treat or dessert."
};


const addFoodMenu = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
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

  const generateDescription = () => {
    const desc = foodDescriptionsMap[foodName.toLowerCase()];
    if (desc) {
      setDescription(desc);
    } else {
      setDescription("No description available for this food item.");
    }
  };

  const Add = async () => {
    setLoading(true);
    if (
      !foodName ||
      !description ||
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
      food: foodName,
      description,
      price: priceRef.current,
      image,
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
        setFoodName("");
        setDescription("");
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
              value={foodName}
              onChangeText={setFoodName}
            />
            <Text style={styles.label}>Food Description</Text>
            <Input
              icon={<Icon name="description" size={26} strokeWidth={1.6} />}
              placeholder="Description of Food"
              value={description} // Ensure it's bound to state
              onChangeText={(value) => setDescription(value)} // Update state correctly
            />
            <Generate
              title="Generate Description"
              onPress={generateDescription}
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
