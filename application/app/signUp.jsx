import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Input from "../components/Input";
import Icon from "../assets/icons";
import Button from "../components/Button";
import axios from "axios";
import Toast from "react-native-toast-message";
import Button1 from "../components/Button1";

const SignUp = () => {
  const router = useRouter();
  const [fname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mnumber, setMatricNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [uniqueKey, setUniqueKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(true); // State to toggle forms

  const onSubmit = async () => {
    const userData = isStudent
      ? { fname, email, mnumber, password }
      : { businessName, location, uniqueKey, email, password };

    if (
      (isStudent && fname && email && mnumber && password) ||
      (!isStudent && businessName && location && uniqueKey && email && password)
    ) {
      axios
        .post("http://192.168.114.185:5000/register", userData)
        .then((res) => {
          console.log(res.data);
          if (res.data.status === "ok") {
            Toast.show({
              type: "success",
              text1: "Account Created Successfully",
            });
            router.push("login");
          } else {
            Toast.show({
              type: "error",
              text1: JSON.stringify(res.data),
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      Toast.show({
        type: "error",
        text1: "Fields are required",
      });
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        <View>
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>
        <ScrollView>
          <View style={styles.form}>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill in the details to create your account
            </Text>

            <View style={styles.ButtonRow}>
              <Button1
                title={"Student"}
                loading={loading}
                onPress={() => setIsStudent(true)}
              />
              <Button1
                title={"Restaurant"}
                loading={loading}
                onPress={() => setIsStudent(false)}
              />
            </View>

            {isStudent ? (
              <>
                <Input
                  icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                  placeholder="John Doe"
                  value={fname}
                  onChangeText={setFullName}
                />

                <Input
                  icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                />

                <Input
                  icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                  placeholder="VUG/SEN/22/1000"
                  value={mnumber}
                  onChangeText={setMatricNumber}
                />

                <Input
                  icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                  placeholder="*******"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </>
            ) : (
              <>
                <Input
                  icon={<Icon name="store" size={26} strokeWidth={1.6} />}
                  placeholder="Business Name"
                  value={businessName}
                  onChangeText={setBusinessName}
                />

                <Input
                  icon={<Icon name="location" size={26} strokeWidth={1.6} />}
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                />

                <Input
                  icon={<Icon name="key" size={26} strokeWidth={1.6} />}
                  placeholder="Unique Key"
                  secureTextEntry
                  value={uniqueKey}
                  onChangeText={setUniqueKey}
                />

                <Input
                  icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                />

                <Input
                  icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                  placeholder="*******"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </>
            )}

            <Button
              title={"Create Account"}
              loading={loading}
              onPress={onSubmit}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.push("login")}>
              <Text
                style={[
                  styles.footerText,
                  {
                    color: theme.colors.primary,
                    fontWeight: theme.fonts.extraBold,
                  },
                ]}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <Toast swipeable={true} />
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

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
    marginBottom: 12,
    marginTop: 10,
  },
  ButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});