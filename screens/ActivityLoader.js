import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export default function ActivityLoader() {
  return (
    <View
    style={{
      zIndex:9000,
      alignItems:'center',
      justifyContent:'center',
      width:'100%',
      height:"100%",
      backgroundColor:'silver',
      opacity:0.5,
    }}
    >
    <ActivityIndicator size="large" color="red" /><Text>Loading</Text>
    </View>
  )
}