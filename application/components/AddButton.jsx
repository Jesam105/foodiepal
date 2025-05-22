import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import Icon from "../assets/icons"; // Assuming you're importing your icon from this path
import { theme } from "../constants/theme";
import { hp } from '../helpers/common';
import Loading from './Loading';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const AddButton = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress = () => {},
  loading = false,
  hasShadow = false,
  iconName, // New prop to pass the icon name
  iconStyle, // New prop to customize icon style
  iconBackground // New prop for icon background color
}) => {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: "white" }]}>
        <Loading />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]} // The gradient colors
      start={{ x: 0, y: 0 }} // Gradient start point
      end={{ x: 1, y: 1 }}   // Gradient end point
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]} // Apply gradient to button styles
    >
      <Pressable onPress={onPress}>
        <View style={styles.content}>
          {iconName && (
            <Icon name={iconName} style={[styles.icon, iconStyle]} />
          )}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      </Pressable>
    </LinearGradient>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  button: {
    height: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.xl,
    marginTop: 30,
    width: '90%',
    marginLeft: 20,
    borderColor: theme.colors.primaryDark,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // Add padding if needed
    borderRadius: theme.radius.sm, // Ensure the background color applies nicely
  },
  icon: {
    marginRight: 8, // Space between the icon and the text
  },
  text: {
    fontSize: hp(3.5),
    color: 'white',
    fontWeight: theme.fonts.medium,
  },
});
