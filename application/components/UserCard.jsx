import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";

const UserCard = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress = () => {},
  loading = false,
  hasShadow = false,
  iconName, // New prop to pass the icon name
  iconStyle,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.content}>
        {iconName && <Icon name={iconName} style={[styles.icon, iconStyle]} />}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  content: {
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginRight: 10,
    marginLeft: 10,
    width: wp(39),
    height: hp(15),
    marginTop: 15,
    justifyContent: "space-between",
    backgroundColor: theme.colors.primary,
  },
  text: {
    fontSize: hp(3.5),
    color: 'white',
    fontWeight: theme.fonts.medium,
  },
  icon: {
    marginTop: 15
  }
});
