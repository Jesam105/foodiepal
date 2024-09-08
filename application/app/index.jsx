import {
  StyleSheet,
  Text,
  View,
  Image,
  PanResponder,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../assets/icons";

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add a loading state
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Respond to swipes only
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Right swipe
          router.push("getStarted");
        }
      },
    })
  ).current;

  useEffect(() => {
    // Check if the user is logged in
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.push("adminHome"); // Redirect to home if token exists
        } else {
          setLoading(false); // If no token, proceed to show the screen
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        setLoading(false); // Proceed even if there is an error
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={styles.loading}
      />
    );
  }

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../assets/images/onboarding3.png")}
        />

        <View style={{ gap: 20 }}>
          <Text style={styles.title}>FoodiePal</Text>
          <Text style={styles.tagline}>
            Just a Tap Away: Streamlining Your University Dining Experience
          </Text>
        </View>

        <View style={styles.footer}>
          <View {...panResponder.panHandlers} style={styles.swipeArea}>
            <Icon name="chevronRight" size={26} strokeWidth={1.6} color={theme.colors.white}/>
            <Text style={styles.swipeText}>Swipe to Get Started</Text>
          </View>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account!</Text>
            <Pressable onPress={() => router.push("adminLog")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primary,
                    fontWeight: theme.fonts.extraBold,
                  },
                ]}
              >
                {" "}
                Login{" "}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingRight: 80,
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  tagline: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  swipeArea: {
    height: hp(7),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    marginHorizontal: wp(3),
  },
  swipeText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: theme.fonts.bold,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: hp(1.6),
    textAlign: "center",
    color: theme.colors.text,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
