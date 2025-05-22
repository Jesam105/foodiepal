import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';

const RestaurantLogo = ({ restaurantName, colors }) => {
  return (
    <LinearGradient
      colors={colors} // Array of gradient colors
      style={styles.card}
      start={[0, 0]} // Gradient start position
      end={[1, 1]}   // Gradient end position
    >
      <Text style={styles.logoText}>{restaurantName}</Text>
    </LinearGradient>
  );
};

export default RestaurantLogo;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
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
    width: wp(39),
    height: hp(15),
    marginTop: 15,
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
