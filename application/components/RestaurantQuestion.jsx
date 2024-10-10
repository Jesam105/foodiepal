import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const RestaurantQuestion = ({ question, colors }) => {
  return (
    <LinearGradient
      colors={colors} // Array of colors for the gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.logoText}>{question}</Text>
    </LinearGradient>
  );
};

export default RestaurantQuestion;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginRight: 10,
    marginLeft: 10,
    width: wp(85),
    height: hp(15),
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  logoText: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: theme.colors.white,
    marginTop: 25,
    textAlign: 'center',
  },
});
