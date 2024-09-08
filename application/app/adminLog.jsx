import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ScrollView,
  BackHandler, // Import BackHandler
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

const LoginScreen = () => {
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
    axios
      .post("http://192.168.48.185:5000/login-restaurant", loginData)
      .then(async (res) => {
        setLoading(false);
        if (res.data.status == "ok") {
          // Store the token
          await AsyncStorage.setItem("token", res.data.token);
          Toast.show({
            type: "success",
            text1: "Logged In Successfully",
          });
          setTimeout(() => {
            router.push("adminHome");
          }, 1000);
        } else {
          Toast.show({
            type: "error",
            text1: "Invalid Credentials",
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

        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>

        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
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

          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          <Button title={"Login"} loading={loading} onPress={onSubmit} />
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
        <Toast swipeable={true} />
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;

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
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 16,
  },
});
