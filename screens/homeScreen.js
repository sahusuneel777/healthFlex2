import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Form from '../components/form'
import CommentsLayer from '../components/commentsLayer'
import commentsFormSkeleton from '../formschema'

export default function HomeScreen() {

  const [formSchema, setFormschema] = useState(JSON.parse(JSON.stringify(commentsFormSkeleton)))

  function closeDialogue(){
    setFormschema(JSON.parse(JSON.stringify(commentsFormSkeleton)))
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff',flex:1, padding: 10 }}>
      <StatusBar barStyle="dark-content" />

      <View style={{height:hp('30%')}}><Form formSkeleton={formSchema} /></View>
      <View style={{height:hp('65%')}}><CommentsLayer /></View>
    </SafeAreaView>
  )
}