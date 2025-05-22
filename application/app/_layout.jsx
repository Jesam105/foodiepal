import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { NavigationContainer } from '@react-navigation/native';

const _layout = () => {
  return (
    <NavigationContainer>
      <Stack
        screenOptions={{
          headerShown: false
        }}

      />
    </NavigationContainer>

  )
}

export default _layout