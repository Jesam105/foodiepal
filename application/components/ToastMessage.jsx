import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Toast from 'react-native-toast-message';
import { theme } from '../constants/theme';
import Icon from '../assets/icons';

const ToastMessage = () => {
  return (
    <Toast
      position='bottom'
      bottomOffset={40}
      config={{
        success: ({ text1, text2 }) => (
          <View style={[styles.toastContainer, styles.success]}>
            <Icon name="tick" size={26} strokeWidth={1.6} color="white" />
            <Text style={styles.toastText}>{text1}</Text>
            {text2 ? <Text style={styles.toastText}>{text2}</Text> : null}
          </View>
        ),
        error: ({ text1, text2 }) => (
          <View style={[styles.toastContainer, styles.error]}>
            <Icon name="error" size={26} strokeWidth={1.6} color="white" />
            <Text style={styles.toastText}>{text1}</Text>
            {text2 ? <Text style={styles.toastText}>{text2}</Text> : null}
          </View>
        ),
      }}
    />
  );
};

export default ToastMessage;

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    gap: 10
  },
  toastText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: theme.fonts.semibold,
  },
  success: {
    backgroundColor: theme.colors.green,
  },
  error: {
    backgroundColor: theme.colors.rose,
  },
});
