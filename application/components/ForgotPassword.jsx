import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Loading from './Loading';
import Icon from "../assets/icons"; // Assuming you're importing your icon from this path

const ForgotPassword = ({
  buttonStyle,
  textStyle,
  title = '',
  onPress = () => {},
  loading = false,
  hasShadow = false,
  iconName, // New prop to pass the icon name
  iconStyle, // New prop to customize icon style
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
      <View style={[styles.button, buttonStyle, { backgroundColor: 'black' }]}>
        <Loading />
      </View>
    );
  }
  return (
    <Pressable
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {iconName && (
          <Icon name={iconName} style={[styles.icon, iconStyle]} />
        )}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.black,
    height: hp(6.6),
    width: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: theme.colors.textLight,
    width: '100%',
    marginBottom: 20
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
    fontSize: hp(2),
    color: theme.colors.textLight,
  },
  
});
