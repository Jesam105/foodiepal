import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

const Input = ({secureTextEntry, ...props}) => {
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
        {
            props.icon && props.icon
        }
        <TextInput
        style={{flex: 1, color: theme.colors.textLight}}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        secureTextEntry={secureTextEntry}
        multiline={secureTextEntry ? false : props.multiline || false}
        {...props} />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: 5,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    },
    multiline: {
      textAlignVertical: "top", // Ensures text starts from the top of the input
      height: 150, // Adjust the height as needed
    },
})