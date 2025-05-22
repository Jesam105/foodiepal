import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
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
import Footer from "../components/Footer";
import UserCard from "../components/UserCard";

const getStarted = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View>
          <Text style={styles.welcomeText}>Select User Type</Text>
          <Text style={{ fontSize: hp(2), color: theme.colors.textLight }}>
            Please choose the box that suits you
          </Text>
        </View>
        <View style={styles.button}>
          <UserCard
            title="Admin"
            iconName="adminUser" // Replace with the actual icon name you want to use
            iconStyle={{ color: "white" }}
            onPress={() => router.push("adminReg")}
          />
          <UserCard
            title="Student"
            onPress={() => router.push("studentReg")}
            iconName="user" // Replace with the actual icon name you want to use
            iconStyle={{ color: "white" }}
          />
        </View>
        <View>
          {/* <Pressable>
            <Button title="Next" />
          </Pressable> */}
        </View>
        <Footer />
      </View>
    </ScreenWrapper>
  );
};

export default getStarted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
    marginTop: 80,
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: theme.colors.bold,
    color: theme.colors.white,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
