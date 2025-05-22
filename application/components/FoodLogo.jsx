import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const FoodLogo = ({ foodName, colors }) => {
    return (
      <LinearGradient colors={colors} style={styles.card}>
        <Text style={styles.logoText}>{foodName}</Text>
      </LinearGradient>
    );
  };

export default FoodLogo;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginRight: 10,
    marginLeft: 10,
    width: wp(25),
    height: hp(10),
    marginTop: 15,
    justifyContent: "space-between",
  },
  logoText: {
    fontSize: hp(1.7),
    fontWeight: 'bold',
    color: theme.colors.white,
    marginTop: 25,
    textAlign: 'center'
  },
});
