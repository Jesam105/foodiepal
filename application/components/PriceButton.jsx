import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import Loading from './Loading'

const PriceButton = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading = false,
    hasShadow = false,

}) => {

    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    }

    if(loading) {
        return(
            <View style={[styles.button, buttonStyle, {backgroundColor: 'white'}]}>
                <Loading />
            </View>
        )
    }
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  )
}

export default PriceButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.black,
        height: hp(4),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 5,
        // marginTop: 2,
        width: '25%',
        borderColor: theme.colors.text,
        borderWidth: 0.4,
    },
    text: {
        fontSize: hp(1.5),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    }
})