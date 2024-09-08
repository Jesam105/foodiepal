import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ScrollView,
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
import Loading from "../components/Loading";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Footer from "../components/Footer";
import Toast from "react-native-toast-message";
import axios from "axios";

const adminReg = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const restaurantRef = useRef("");
  const locationRef = useRef("");
  const secretkeyRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const onSubmit = async () => {
    setLoading(true);
    if (
      !locationRef.current ||
      !secretkeyRef.current ||
      !emailRef.current ||
      !restaurantRef.current ||
      !passwordRef.current
    ) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }
    const restaurantData = {
      restaurant: restaurantRef.current, // Accessing the current value
      location: locationRef.current,
      secretkey: secretkeyRef.current,
      email: emailRef.current,
      password: passwordRef.current,
    };
    axios
      .post("http://192.168.48.185:5000/restaurant", restaurantData)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === "ok") {
          Toast.show({
            type: "success",
            text1: "Account Created Successfully",
          });
          setTimeout(() => {
            router.push("adminLog");
          }, 3000);
        } else {
          Toast.show({
            type: "error",
            text1: JSON.stringify(res.data),
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "An error occurred",
        });
        console.log(e);
      });
  };
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} onPress={() => router.back()} />
        <ScrollView
          showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <Text style={styles.welcomeText}>
              Create an account for your business
            </Text>
          </View>
          <View style={styles.form}>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill in the details to register yout business
            </Text>
            <Input
              icon={<Icon name="home" size={26} strokeWidth={1.6} />}
              placeholder="Name of Restaurant"
              onChangeText={(value) => (restaurantRef.current = value)}
            />
            <Input
              icon={<Icon name="location" size={26} strokeWidth={1.6} />}
              placeholder="Location"
              onChangeText={(value) => (locationRef.current = value)}
            />
            <Input
              icon={<Icon name="edit" size={26} strokeWidth={1.6} />}
              placeholder="Secret Key"
              onChangeText={(value) => (secretkeyRef.current = value)}
              secureTextEntry
            />
            <Input
              icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
              placeholder="Enter your email"
              onChangeText={(value) => (emailRef.current = value)}
            />
            <Input
              icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
              placeholder="Password"
              onChangeText={(value) => (passwordRef.current = value)}
              secureTextEntry
            />
            <Button title={"Submit"} loading={loading} onPress={onSubmit} />
          </View>
          <Footer />
        </ScrollView>
        <Toast swipeable={true} />
      </View>
    </ScreenWrapper>
  );
};

export default adminReg;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.colors.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
});
