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
import ToastMessage from "../components/ToastMessage";

const adminReg = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const restaurantRef = useRef("");
  const locationRef = useRef("");
  const usertypeRef = useRef("");
  const secretkeyRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [usertype, setUserType] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    if (
      !locationRef.current ||
      !secretkeyRef.current ||
      !usertypeRef ||
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
      restaurant: restaurantRef.current,
      location: locationRef.current,
      secretkey: secretkeyRef.current,
      email: emailRef.current,
      password: passwordRef.current,
      usertype: usertypeRef.current,
    };

    axios
      .post("http://192.168.178.185:5000/restaurant", restaurantData)
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
            text1: res.data.message || "An error occurred",
          });
        }
      })
      .catch((e) => {
        setLoading(false);

        // Check for specific backend errors
        if (e.response) {
          const status = e.response.status;
          const data = e.response.data;

          if (status === 409) {
            // Conflict error: Restaurant already exists
            Toast.show({
              type: "error",
              text1: "Restaurant already exists",
            });
          } else if (status === 400 && data.message === "Invalid Secret Key") {
            // Bad request: Incorrect secret key
            Toast.show({
              type: "error",
              text1: "Invalid Secret Key",
            });
          } else {
            // Other backend errors
            Toast.show({
              type: "error",
              text1: data.message || "An error occurred",
            });
          }
        } else if (e.request) {
          // Network error (no response received)
          Toast.show({
            type: "error",
            text1: "Check your internet connection and try again",
          });
        } else {
          // Other types of errors
          Toast.show({
            type: "error",
            text1: e.message || "An unknown error occurred",
          });
        }

        console.log(e);
      });
  };

  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} onPress={() => router.back()} />
          <Text style={styles.welcomeText}>
            Create An Account
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text
              style={{
                fontSize: hp(1.5),
                color: theme.colors.textLight,
                paddingTop: 20,
              }}
            >
              Please fill in the details to register your business
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
            <View>
              <Input
                icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                placeholder="Password"
                onChangeText={(value) => (passwordRef.current = value)}
                secureTextEntry={!passwordVisible}
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

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={usertype}
                onValueChange={(itemValue) => {
                  setUserType(itemValue);
                  usertypeRef.current = itemValue;
                }}
                style={styles.picker}
              >
                <Picker.Item label="-Verify User-" value="" />
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Student" value="student" />
              </Picker>
            </View>
            <Button title={"Submit"} loading={loading} onPress={onSubmit} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.push("adminLog")}>
              <Text
                style={[
                  styles.footerText,
                  {
                    color: theme.colors.primary,
                    fontWeight: theme.fonts.extraBold,
                  },
                ]}
              >
                Sign In
              </Text>
            </Pressable>
          </View>
          {/* <Footer /> */}
        </ScrollView>
        <ToastMessage swipeable={true} />
      </View>
    </ScreenWrapper>
  );
};

export default adminReg;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: theme.fonts.medium,
    color: theme.colors.white,
  },
  form: {
    gap: 25,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.textLight,
    fontSize: hp(1.6),
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
    backgroundColor: theme.colors.black,
    color: theme.colors.textLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 80,
  },
});
