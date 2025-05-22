import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastMessage from "../components/ToastMessage";
import ForgotPassword from "../components/ForgotPassword";

const adminLog = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // This prevents the default behavior of going back
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // Cleanup the event listener on component unmount
      return () => backHandler.remove();
    }, [])
  );

  const onSubmit = async () => {
    setLoading(true);

    if (!emailRef.current || !passwordRef.current) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }

    const loginData = {
      email: emailRef.current,
      password: passwordRef.current,
    };

    try {
      const response = await axios.post(
        "http://192.168.178.185:5000/login",
        loginData
      );

      const { token, usertype, id } = response.data; // Extract id from response

      // Store token, usertype, and id (only if user is admin) in AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("usertype", usertype);

      if (usertype === "admin" && id) {
        await AsyncStorage.setItem("id", id); // Store id for admin users
      }

      Toast.show({ type: "success", text1: "Logged In Successfully" });

      // Navigate to the correct home screen based on usertype
      if (usertype === "student") {
        setTimeout(() => {
          router.push("studentHome");
        }, 3000);
      } else if (usertype === "admin") {
        setTimeout(() => {
          router.push("adminHome");
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Invalid credentials or server error",
      });
      console.error(error);
    }
  };

  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            router={router}
            onPress={() => {
              Alert.alert("Hold on!", "Are you sure you want to exit?", [
                {
                  text: "Cancel",
                  onPress: () => null,
                  style: "cancel",
                },
                { text: "YES", onPress: () => BackHandler.exitApp() },
              ]);
            }}
          />
          <Text style={styles.welcomeText}>Sign In To Continue</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.textLight }}>
              Please login to continue
            </Text>
            <Input
              icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
              placeholder="Enter Email Address"
              onChangeText={(value) => (emailRef.current = value)}
            />
            <View>
              <Input
                icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                onChangeText={(value) => (passwordRef.current = value)}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Icon
                  name={passwordVisible ? "eyeOpen" : "eyeClose"} // Use your custom icon names here
                  size={26}
                  strokeWidth={1.6}
                />
              </Pressable>
            </View>
            <Button title={"Login"} loading={loading} onPress={onSubmit} />
            <ForgotPassword title={"Forgot Password?"} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Pressable onPress={() => router.push("adminReg")}>
              <Text
                style={[
                  styles.footerText,
                  {
                    color: theme.colors.primary,
                    fontWeight: theme.fonts.extraBold,
                  },
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <ToastMessage swipeable={true} />
      </View>
    </ScreenWrapper>
  );
};

export default adminLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: theme.fonts.medium,
    marginBottom: 10,
    color: theme.colors.white,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textALign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,   
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.textLight,
    fontSize: hp(1.6),
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 80,
  },
});
