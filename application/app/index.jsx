import {
  StyleSheet,
  Text,
  View,
  Image,
  PanResponder,
  Pressable,
  ActivityIndicator,
  Animated,
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
  const swipeAnim = useRef(new Animated.Value(0)).current; // Animation value for swipe

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          swipeAnim.setValue(gestureState.dx); // Set animation value to swipe distance
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 150) {
          // When the swipe is far enough, reset animation before navigating
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => {
            router.push("getStarted");
          });
        } else {
          // Reset the animation if not swiped far enough
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userType = await AsyncStorage.getItem("usertype");

        if (token && userType) {
          if (userType === "student") {
            router.push("studentHome");
          } else if (userType === "admin") {
            router.push("adminHome");
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        setLoading(false);
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
    <ScreenWrapper bg="black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../assets/images/food.png")}
        />

        <View style={styles.Text}>
          <Text style={styles.title}>FoodiePal</Text>
          <Text style={styles.tagline}>
            Just a Tap Away: Streamlining Your University Dining Experience
          </Text>
        </View>

        <View style={styles.footer}>
          <View {...panResponder.panHandlers} style={styles.swipeArea}>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    {
                      translateX: swipeAnim.interpolate({
                        inputRange: [0, 150], // Max swipe distance
                        outputRange: [0, wp(76)], // Move icon across the width
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                },
              ]}
            >
              <Icon
                name="chevronRight"
                size={26}
                strokeWidth={1.6}
                color={theme.colors.white}
              />
            </Animated.View>
            <Text style={styles.swipeText}>Swipe to Get Started</Text>
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
    paddingVertical: wp(15),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
    marginTop: 50,
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
    backgroundColor: theme.colors.text,
    borderRadius: 10,
    marginHorizontal: wp(3),
    overflow: "hidden",
  },
  swipeText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: theme.fonts.bold,
  },
  iconContainer: {
    position: "absolute",
    left: wp(0),
    backgroundColor: theme.colors.primary,
    height: hp(7),
    justifyContent: "center",
    alignItems: "center",
    width: wp(10),
    borderRadius: 10,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
