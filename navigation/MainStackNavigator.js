import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DraweNavigator from './DraweNavigator'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LogInScreen/LoginScreen'
import TabNavigator from './TabNavigator'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeUserData } from '../Services/store/slices/profileSlice'

const MainStackNavigator = () => {
  const Stack = createNativeStackNavigator();

  const [UserStore, setUserStore] = useState(null);
  const dispatch = useDispatch()
  const user = useSelector(state => state.storeUserData);
  // console.log(user.userData);
  const [IsSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    getData()
  }, [])

  // console.log('asc storeage', UserStore);
  if (UserStore !== null) {
    dispatch(storeUserData(UserStore))
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@userData')
      if (jsonValue != null) {
        setUserStore(JSON.parse(jsonValue))
        setIsSignedIn(true)
      }
      else {
        null
        setIsSignedIn(false)
      }
    } catch (e) {
    }

  }
  return (
    <Stack.Navigator>
      {
        user.userData == undefined ?
          <Stack.Screen
            name='LoginScreen'
            component={LoginScreen}
            options={{
              headerShown: false,
              animationTypeForReplace: IsSignedIn ? 'pop' : 'push'
            }}
          /> :
          <Stack.Screen
            name='DraweNavigator'
            component={DraweNavigator}
            options={{
              headerShown: false,
            }}
          />

      }
      {/* {
        1 !==1
          ?
          <Stack.Screen
            name='DraweNavigator'
            component={DraweNavigator}
            options={{
              headerShown: false,
            }}
          /> :
          <Stack.Screen
            name='LoginScreen'
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
      } */}

    </Stack.Navigator>
  )
}

export default MainStackNavigator

const styles = StyleSheet.create({})