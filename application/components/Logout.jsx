import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'

const Logout = ({size=26, onPress}) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
        <Icon name="logout" strokeWidth={2.5} size={size} color={theme.colors.text} />
    </Pressable>
  )
}

export default Logout

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.07)'
    }
})