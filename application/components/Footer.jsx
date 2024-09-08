import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from './ScreenWrapper'
import { StatusBar } from 'expo-status-bar'

const Footer = () => {
  return (
    <ScreenWrapper bg="white">
        <StatusBar style='dark' />
        <View style={styles.container}>
            <Text>Powered by Jesam Obona 🧑‍💻⚙️</Text>
        </View>
    </ScreenWrapper>
  )
}

export default Footer

const styles = StyleSheet.create({
    container: {
        flex: 1,                // Fills the available space
        justifyContent: 'flex-end', // Moves content to the bottom
        alignItems: 'center',   // Centers content horizontally
        paddingBottom: 20,      // Adds some space at the bottom
      },
})