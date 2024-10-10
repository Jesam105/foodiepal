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

const getStarted = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View>
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>
        <View style={styles.button}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.primary }}>
            Please select the button that suits you
          </Text>
          <Button title={"Admin"} onPress={() => router.push("adminReg")} />
          <Button
            title={"Student"}
            onPress={() => router.push("studentReg")}
          />
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
    fontSize: hp(4),
    fontWeight: theme.colors.bold,
    color: theme.colors.white,
  },
});
